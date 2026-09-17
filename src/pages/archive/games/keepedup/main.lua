
class = require("libs.sunclass")
math2d = require("libs.math2d")
easing = require("libs.easing")
require("libs.easingex")

local SpriteSheet = require("spritesheet")

love.physics.setMeter(100)
love.graphics.setDefaultFilter('nearest', 'nearest')

if not love.touch then
    love.window.setMode(640/2, 1096/2)
end

Scale = love.graphics.getHeight()/480

spriteHand = SpriteSheet:new("img/hand2.gif", 60, 60)
spriteObject = SpriteSheet:new("img/keepedup_objects.gif", 32, 32)
spriteEd = SpriteSheet:new("img/keepedup_ed.gif", 64, 64)
spriteCoin = SpriteSheet:new("img/keepedup_coin.gif", 64, 64)
spriteBomb = SpriteSheet:new("img/bombsheet.gif", 64, 32)
spriteParticle = SpriteSheet:new("img/keepedup_smashsheet.gif", 64, 64)
spriteSlash = SpriteSheet:new("img/keepedup_slashsheet.gif", 32, 32)
spriteLaser = SpriteSheet:new("img/keepedup_attacksheet.gif", 320, 64)
spritePoopPants = SpriteSheet:new("img/keepedup_pooppantssheet.gif", 64, 64)
spriteBackground = love.graphics.newImage("img/keepedup_background.gif")
boldFont = love.graphics.newFont("img/slkscre.ttf", 32*Scale)
boldFont2 = love.graphics.newFont("img/slkscre.ttf", 32)
myFont = love.graphics.newImageFont("img/keepedup_font2.gif", "0123456789+ABCDEFGHIJKLMNOPQRSTUVWXYZ !?.,$-")
love.graphics.setFont(boldFont)

local ol_src = love.audio.newSource
sourcetable = {}
function love.audio.newSource(name)
    local source
    if love.touch then
        source = ol_src(love.sound.newSoundData(name))
    else
        source = ol_src(name)
    end
    table.insert(sourcetable, source)
    return source
end

local Game = require("game")

function love.load(arg)
    math.randomseed(love.timer.getTime())
    game = Game:new()
end

function love.update(dt)
    game:update(dt)
end

function love.draw()
    game:draw()
    -- love.graphics.setFont(myFont)
    -- love.graphics.print("195819203467", 0, 0)
    -- love.graphics.setFont(boldFont)
end

function love.mousepressed(x, y, button)
    game:mousepressed(x, y, button)
end

function love.mousereleased(x, y, button)
    game:mousereleased(x, y, button)
end

function love.keypressed(key, isrepeat)
    if key == "enter" or key == "return" then
        love.keyboard.setTextInput(false)
    end
end

function love.textinput(text)

end
