var sans;
var mySudoku = 0;
var puzzle, position, gueses, cyles;
var I = Math.floor;
var lastVal;
var solving = 0;
position = [-1];
gueses = [new Array()];
var sudoku;
var sudokuArray;
var sudoku2DArray = new Array(9);
sudoku2DArray[0] = new Array(9);
sudoku2DArray[1] = new Array(9);
sudoku2DArray[2] = new Array(9);
sudoku2DArray[3] = new Array(9);
sudoku2DArray[4] = new Array(9);
sudoku2DArray[5] = new Array(9);
sudoku2DArray[6] = new Array(9);
sudoku2DArray[7] = new Array(9);
sudoku2DArray[8] = new Array(9);
var sudoku2DAns = new Array(9);
sudoku2DAns[0] = new Array(9);
sudoku2DAns[1] = new Array(9);
sudoku2DAns[2] = new Array(9);
sudoku2DAns[3] = new Array(9);
sudoku2DAns[4] = new Array(9);
sudoku2DAns[5] = new Array(9);
sudoku2DAns[6] = new Array(9);
sudoku2DAns[7] = new Array(9);
sudoku2DAns[8] = new Array(9);

function LoadNewSudoku(sDifficulty) {
    $("#Difficulty").val(sDifficulty);
    frmNewSudoku.submit()
}

function InitializeSudoku(sType) {
    if (sType == 2) {
        if (confirm("Current puzzle will be lost.\n\nAre you sure to continue?")) {
            mySudoku = 1;
            sudoku = "000000000000000000000000000000000000000000000000000000000000000000000000000000000";
            doFillTable()
        } else {
            return false
        }
    } else {
        mySudoku = 0;
        sudoku = document.getElementById("CurSudokuString").value;
        doFillTable()
    }
    $(".sTextBox").bind("blur", function () {
        var cid = this.id;
        var tmp = cid.split('');
        var row = parseInt(tmp[1]) - 1;
        var col = parseInt(tmp[2]) - 1;
        if (this.value == '') {
            $(this).css("color", "black");
            $(this).removeClass("jq-error");
            sudoku2DAns[row][col] = 0;
            ValidateSudoku()
        }
    });
    $(".sTextBox").bind("keypress", function (event) {
        event.preventDefault();
        if (this.readOnly) {
            return false
        }
        var val = parseInt(String.fromCharCode(event.which));
        if ((event.which > 48 && event.which < 58) || (event.which == 8 || event.which == 46)) {
            var errflag = 0;
            var cid = this.id;
            var tmp = cid.split('');
            var row = parseInt(tmp[1]) - 1;
            var col = parseInt(tmp[2]) - 1;
            if (event.which == 8 || event.which == 46) {
                sudoku2DAns[row][col] = 0
            } else {
                $(this).val(val);
                sudoku2DAns[row][col] = val
            }
            ValidateSudoku()
        } else {
            return false
        }
    })
}

function doFillTable() {
    $(".sTable input.sTextBox").removeClass("jq-error");
    ClearSudokuTable();
    $(".sTable input.sTextBox").css('color', 'black');
    if (sudoku.length != 81) {
        alert("Bad Sudoku String");
        return false
    }
    sudoku2DAns = Convert2DArray(sudoku);
    sudokuArray = sudoku.split("");
    var cnt = 0;
    for (var row = 1; row <= 9; row++) {
        for (var col = 1; col <= 9; col++) {
            var e = "s" + row + col;
            if (sudokuArray[cnt] != '0') {
                document.getElementById(e).value = sudokuArray[cnt];
                $("#" + e).attr("readonly", "true")
            } else {
                $("#" + e).addClass("cgbox")
            }
            cnt++
        }
    }
}

function ValidateSudoku() {
    var cnt = 0;
    for (var r = 1; r <= 9; r++) {
        for (var c = 1; c <= 9; c++) {
            var cev = sudoku2DAns[r - 1][c - 1];
            if (cev != 0) {
                var errcode = Check_Row_Column_Grid(r - 1, c - 1, cev);
                if (errcode != '5') {
                    $("#s" + r + c).css("color", "red");
                    $("#s" + r + c + ":[readonly='']").css("color", "#5197ed");
                    $("#s" + r + c).addClass("jq-error");
                    $("#s" + r + c).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
                } else {
                    if ($("#s" + r + c).hasClass("cgbox")) {
                        $("#s" + r + c).css("color", "#00b762")
                    } else {
                        $("#s" + r + c).css("color", "black")
                    }
                    $("#s" + r + c).removeClass("jq-error")
                    cnt++
                }
            }
        }
    }
    if(cnt == 81){
        $(".sudoku-box").addClass('sudoku-solved');
        $(".effect-close-box").removeClass('d-none');

    }
    else{
        $(".sudoku-box").removeClass('sudoku-solved');
        $(".effect-close-box").addClass('d-none');
    }

}

function clearFireworks(){
    $(".sudoku-box").removeClass('sudoku-solved');
    $(".effect-close-box").addClass('d-none');
}

function Check_Row_Column_Grid(Row, Col, val) {
    for (var i = 0; i < 9; i++) {
        if ((val == sudoku2DAns[Row][i]) && (i != Col)) {
            var clashelem = "s" + (Row + 1) + (i + 1);
            errcode = "1";
            return errcode
        }
    }
    for (var i = 0; i < 9; i++) {
        if ((val == sudoku2DAns[i][Col]) && (i != Row)) {
            var clashelem = "s" + (i + 1) + (Col + 1);
            errcode = "2";
            return errcode
        }
    }
    for (i = (Math.floor(Row / 3) * 3); i < (Math.floor(Row / 3) * 3) + 3; i++) {
        for (j = (Math.floor(Col / 3) * 3); j < (Math.floor(Col / 3) * 3) + 3; j++) {
            if ((val == sudoku2DAns[i][j]) && ((i != Row) && (j != Col))) {
                var clashelem = "s" + (i + 1) + (j + 1);
                errcode = "3";
                return errcode
            }
        }
    }
    errcode = "5";
    return errcode
}

function ResetSudokuTable() {
    if (mySudoku == 1) {
        InitializeSudoku(2)
    } else {
        if (confirm("Are you sure?")) {
            InitializeSudoku(1)
        } else {
            return false
        }
    }
}

function ClearSudokuTable() {
    $(".sTable input.sTextBox").val('');
    $(".sTable input.sTextBox").removeAttr("readonly");
    $(".sTable input.sTextBox").css('color', 'black')
}

function Convert2DArray(sudoku) {
    if (sudoku.length != 81) {
        alert("Bad Sudoku String");
        return false
    }
    sudokuArray = sudoku.split("");
    var cnt = 0;
    for (var row = 1; row <= 9; row++) {
        for (var col = 1; col <= 9; col++) {
            sudoku2DArray[row - 1][col - 1] = sudokuArray[cnt];
            cnt++
        }
    }
    return sudoku2DArray
}

function doSolveInit() {
    if ($(".sTable input.sTextBox").hasClass("jq-error")) {
        alert('Kindly fix the errors shown in red colour to proceed further.')
    } else {
        if (confirm('Do you want to fill the remaining numbers by computer?')) try {
            var f = sudoku2DAns.join('').replace(/,/g, "");
            puzzle = f.split('');
            var res = solve_fast();
            if (res == 0) {
                alert('The puzzle cannot be solved.\n\nTry with alternate values that you have entered.')
            }
        } catch (e) {
        }
    }
}

function solve_fast() {
    for (var i = 0; i < 81; i++) {
        if (puzzle[i] > 0) continue;
        var used = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        for (var j = 0; j < 81; j++) {
            if ((I(j / 9) == I(i / 9)) || (I(j % 9) == I(i % 9)) || ((I(j / 27) == I(i / 27)) && (I(j % 9 / 3) == I(i % 9 / 3)))) {
                used[puzzle[j]] = 1
            } else {
                used[0] = 1
            }
        }
        for (var j = 1; j < 10; j++) {
            if (used[j] == 0) {
                puzzle[i] = j;
                solve_fast();
                puzzle[i] = 0
            }
        }
        return (0)
    }
    fillSolution();
    throw("done")
}

function fillSolution() {
    $(".sTable input.sTextBox:[value=]").css("color", "#D2691E");
    $(".sTable input.sTextBox").attr("readonly", true);
    var cnt = 0;
    for (var r = 1; r <= 9; r++) {
        for (var c = 1; c <= 9; c++) {
            sudoku2DAns[r - 1][c - 1] = puzzle[cnt];
            cnt++
        }
    }
    sans = puzzle;
    var cnt = 0;
    for (var row = 1; row <= 9; row++) {
        for (var col = 1; col <= 9; col++) {
            var e = "s" + row + col;
            if (sans[cnt] != '0') {
                document.getElementById(e).value = sans[cnt]
            }
            cnt++
        }
    }
}

function LoadSudoku() { InitializeSudoku(1); };

$(document).ready(function (){
    LoadSudoku();
    }
)