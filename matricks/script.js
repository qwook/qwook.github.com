var environment, output, outputMatrix, evaluate, updateHistory;
var history = [];
var historyIndex = 0;
var saveInput = "";

environment = {
    get help() {
        output("Defining matrices: mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]");
        output("");
        output("Constants: PI");
        output("");
        output("Functions:");
        output("\tscale(matrix, row, multiplier)");
        output("\treplace(matrix, target row, multiplier, aggressor row)");
        output("\tswap(matrix, first row, second row)");
        output("\tclone(matrix)");
        output("");
        output("\tEach function will generate a new matrix instead of manipulating the old one.");
        output("");
        output("Commands:");
        output("\tclear\t clears console");
        output("\thelp\t displays help");
    },

    get clear() {
        $("#output").html("");
    },

    get PI() {
        return Math.PI;
    },

    get swap() {
        return function(mat, a, b) {
            if (a-1 < mat.length && b-1 < mat.length) {
                var arr = [];
                for (var i = 0; i < mat.length; i++) {
                    if (i == a-1)
                        arr[i] = mat[b-1].slice(0);
                    else if (i == b-1)
                        arr[i] = mat[a-1].slice(0);
                    else
                        arr[i] = mat[i].slice(0);
                }
                return arr;
            }
            return [];
        }
    },

    get replace() {
        return function(mat, target, multiplier, aggressor) {
            if (target-1 < mat.length && aggressor-1 < mat.length
                && mat[target-1].length == mat[aggressor-1].length) {
                var arr = [];
                for (var i = 0; i < mat.length; i++) {
                    arr[i] = mat[i].slice(0);
                    if (i == target-1)
                        for (var c = 0; c < mat[aggressor-1].length; c++) {
                            arr[i][c] += mat[aggressor-1][c]*multiplier;
                        }
                }
                return arr;
            }
            return [];
        }
    },

    get scale() {
        return function(mat, row, scalar) {
            if (row-1 < mat.length) {
                var arr = [];
                for (var i = 0; i < mat.length; i++) {
                    arr[i] = mat[i].slice(0);
                    if (i == row-1)
                        for (var c = 0; c < mat[row-1].length; c++) {
                            arr[i][c] *= scalar;
                        }
                }
                return arr;
            }
            return [];
        }
    },
    
    window: null,
    document: null,
    print: function(str) {output(str);}
}

output = function(text) {
    if (text instanceof Array && text[0] instanceof Array) {
        outputMatrix(text);
    } else {
        var line = $("<pre></pre>");
        line.text(text);
        $("#output").append(line);
        $("#output").scrollTop($("#output")[0].scrollHeight);
    }
}

outputMatrix = function(matrix) {
    for(var i = 0; i < matrix.length; i++)
    {
        var mat = matrix[i];
        output(mat.join("\t"));
    }
}

evaluate = function(command) {
    with(environment) {
        try
        {
            output(eval(command));
        }
        catch(e)
        {
            output(e);
        }
    }
}

updateHistory = function() {
    var newInput = "";

    if (historyIndex >= history.length)
    {
        historyIndex = history.length;
    }

    if (historyIndex < 0)
    {
        historyIndex = 0;
    }

    if (historyIndex == 0)
    {
        newInput = saveInput;
    }
    else if (historyIndex <= history.length)
    {
        newInput = history[history.length - (historyIndex)];
    }
    $("#cmd").val(newInput);
}

$("#cmd").keypress(function(e) {
    if (e.which == 13) // enter
    {
        e.preventDefault();

        history.push($(this).val());
        output(">> " + $(this).val());
        evaluate.call(evaluate, $(this).val());
        $(this).val("");

        historyIndex = 0;
    }
    else if (e.keyCode == 38) // up
    {
        e.preventDefault();

        if (historyIndex == 0)
            saveInput = $("#cmd").val();

        historyIndex++;
        updateHistory();
    }
    else if (e.keyCode == 40) // down
    {
        e.preventDefault();

        if (historyIndex == 0)
            saveInput = $("#cmd").val();

        historyIndex--;
        updateHistory();
    }

    output(keyCode);
});

$(document).click(function(e) {
    $("#cmd").focus();
});

$(function() {
    output("Matricks v0.0.1");
    output("By (c) Henry <qwook> Tran " + (new Date()).getFullYear());
    output("Licensed under GPLv2");
    output("Matricks is essentially a javascript console and not an interpreter.");
    output("It is designed to be used only as a tool.");
    output("idk how copyright or licensing works");
    output("Type 'help' for help.");
})
