const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const path = require("path");

function getHeadAndBodyChunks(chunks) {
  const headChunks = [];
  const bodyChunks = [];

  chunks.forEach((chunk) => {
    if (
      chunk.attributes &&
      ((chunk.attributes.src && chunk.attributes.src.includes("_head")) ||
        chunk.attributes.href)
    ) {
      headChunks.push(chunk);
    } else {
      bodyChunks.push(chunk);
    }
  });

  return { headChunks, bodyChunks };
}

function addAttributesToTag(tag, name, attributes) {
  if (tag.attributes.src) {
    const regex = new RegExp(`(\/${name}\\.)|(${name}\\.)`);
    if (tag.attributes.src.match(regex)) {
      tag.attributes = { ...tag.attributes, ...attributes };
    }
  }
}

function handleChunksConfig(data, tags) {
  if (data.plugin.options.chunksConfig) {
    const asyncNames = data.plugin.options.chunksConfig.async;
    const deferNames = data.plugin.options.chunksConfig.defer;

    if (asyncNames && typeof asyncNames === "object" && asyncNames.length) {
      tags.forEach((tag) => {
        // add async only on script tags.
        if (!tag.attributes.href && tag.attributes.src) {
          asyncNames.forEach((name) => {
            addAttributesToTag(tag, name, { async: true });
          });
        }
      });
    }

    if (deferNames && typeof deferNames === "object" && deferNames.length) {
      tags.forEach((tag) => {
        // add defer only on script tags.
        if (!tag.attributes.href && tag.attributes.src) {
          deferNames.forEach((name) => {
            addAttributesToTag(tag, name, { defer: true });
          });
        }
      });
    }
  }
}

class TitleInjectorPlugin {
  apply(compiler) {
    // HtmlWebpackPlugin version 4.0.0-beta.5
    if (HtmlWebpackPlugin.getHooks) {
      compiler.hooks.compilation.tap("TitleInjectorPlugin", (compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
          "TitleInjectorPlugin",
          (data, callback) => {
            const tags = [...data.bodyTags, ...data.headTags];
            handleChunksConfig(data, tags);
            const chunks = getHeadAndBodyChunks(tags);

            const chunk = compilation.chunks.find(
              (value) => value.name === data.plugin.options.chunks[0]
            );

            for (const file of chunk.files) {
              global.window = {};
              global.NODE_ENV = true;
              try {
                console.log(require("./" + path.join("node", file)));
              } catch (e) {
                if (e.headTag) {
                  e.title &&
                    data.headTags.push(
                      HtmlWebpackPlugin.createHtmlTagObject(
                        "title",
                        {},
                        e.title
                      )
                    );
                  e.image &&
                    data.headTags.push(
                      HtmlWebpackPlugin.createHtmlTagObject("meta", {
                        name: "og:image",
                        property: "og:image",
                        content: "/" + e.image,
                      })
                    );
                  e.description &&
                    data.headTags.push(
                      HtmlWebpackPlugin.createHtmlTagObject("meta", {
                        name: "og:description",
                        property: "og:description",
                        content: "/" + e.description,
                      })
                    );
                  console.log(data.headTags);
                } else {
                  console.log(e);
                }
              }

              // const asset = compilation.assets[file];
              // const match = asset
              //   .source()
              //   .toString()
              //   .match(/window.PAGE_METADATA=({.+,end:!0})/m);
              // if (match) {
              //   console.log(match[1]);
              // }
            }
            // console.log(data.headTags);

            callback(null, data);
          }
        );
      });
    } else {
      // HtmlWebpackPlugin version 3.2.0
      compiler.plugin("compilation", (compilation) => {
        compilation.plugin("html-webpack-plugin-alter-asset-tags", (data) => {
          const tags = [...data.body, ...data.head];
          handleChunksConfig(data, tags);
          const chunks = getHeadAndBodyChunks(tags);

          data.head = chunks.headChunks;
          data.body = chunks.bodyChunks;
        });
      });
    }
  }
}

module.exports = TitleInjectorPlugin;
