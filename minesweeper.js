var boardMat;

function start() {
    var size = parseInt(document.getElementById("size").value);
	var quantity = parseInt(document.getElementById("quantity").value);

	var board = document.getElementById("board");

	if (isNaN(size) || isNaN(quantity) || size < 0 || size > 50 || quantity < 0 || quantity > 50  || quantity >= size ** 2) {
		alert("Invalid Settings");
		return;
	} else {
		boardMat = generateMatrix(size,quantity);
		board.innerHTML = getBoardUI(size);
	}

}

function cellClick(target) {
	const coords = target.split('-')
				.map(num => parseInt(num, 10))
				.filter(num => !isNaN(num));

	const cell = document.getElementById(target);

	const cellContent = boardMat[coords[0]][coords[1]];

	const fillCell = (content) => `<p class="p-0 m-0 text-center">${content}</p>`;
	const numCell = (content) => fillCell(content);
	const mineCell = () => fillCell("*");
	const emptyCell = () => fillCell(" ");

	if (cellContent === 0) {
		cell.innerHTML = emptyCell();
		return blankCell(...coords, cell);
	} else if (cellContent > 8) {
		// TODO Stop Game
		cell.innerHTML = mineCell();
		return;
	} else {
		cell.innerHTML = numCell(cellContent);
		return;
	}
}

function blankCell(i, j, cell) {
	cell.classList.add("open");

	const isCellClosed = (i,j) => !document.getElementById(`cell-${i}-${j}`).classList.contains("open");
	console.log(`current: cell-${i}-${j}`);

	if (i > 0) {
		if (j > 0 && isCellClosed(i-1, j-1)) {
			cellClick(`cell-${i-1}-${j-1}`); // (1)
		}
		if (j < boardMat.length-1 && isCellClosed(i-1,j+1)) {
			cellClick(`cell-${i-1}-${j+1}`); // (3)
		}
		console.log(`cell-${i-1}-${j}`);
		if (isCellClosed(i-1, j)) {
			cellClick(`cell-${i-1}-${j}`); // (2)
		}
	}
	if (i < boardMat.length-1) {
		if (j > 0 && isCellClosed(i+1, j-1)) {
			cellClick(`cell-${i+1}-${j-1}`); // (7)
		}
		if (j < boardMat.length-1 && isCellClosed(i+1, j+1)) {
			cellClick(`cell-${i+1}-${j+1}`);// (9)
		}
		if (isCellClosed(i+1, j)) {
			cellClick(`cell-${i+1}-${j}`);// (8)
		}
	}
	if (j > 0 && isCellClosed(i, j-1)) {
		console.log(`cell-${i}-${j-1}`);
		cellClick(`cell-${i}-${j-1}`);// (4)
	}
	if (j < boardMat.length-1 && isCellClosed(i, j+1)) {
		cellClick(`cell-${i}-${j+1}`);// (6)
	}

	return;
}

function getBoardUI(size){
    var table = "";

    table = `<table class="mx-auto">\n<tbody>\n`;

    for (var i = 0; i < size; i++) {
        table += `<tr class="cell-height">\n`;
        for (var j = 0; j < size; j++) {
            table += `<td class="m-0 p-0 b-0 cell-height cell-width" id="cell-${i}-${j}">
                <button class="m-0 p-0 cell-height cell-width" id="btn-${i}-${j}" onclick="cellClick('cell-${i}-${j}')">
                </button>
                </td>\n`;
        }
        table += `</tr>\n`;
    }

	table += `</tbody>\n</table>`;
	
	return table;
}

function generateMatrix(size, quantity) {
	var board = new Array(size).fill();
	for (var i = board.length - 1; i >= 0; i--) {
		board[i] = new Array(size).fill(0);
	}

	var count = 0;

	var i,j;

	while (count < quantity) {
		i = getRandomIntRange(0, size);
		j = getRandomIntRange(0, size);

		if (board[i][j] !== 9) {
			board[i][j] = 9;
			count++;
		}
	}

	fillBoard(board);

	return board;
}

function getRandomIntRange(min, max) {
	return Math.floor((max - min) * Math.random() + min)
}

function fillBoard(board) {
	var size = board.length;

	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (board[i][j] > 8) {
				if (i !== 0) {
					board[i-1][j] += (board[i-1][j] > 8) ? 0:1; // (2)

					if (j !== 0) {
						board[i-1][j-1] += (board[i-1][j-1] > 8) ? 0:1; // (1)
					}
					if (j !== size - 1) {
						board[i-1][j+1] += (board[i-1][j+1] > 8) ? 0:1; // (3)
					}
				}
				if (i !== size-1) {
					board[i+1][j] += (board[i+1][j] > 8) ? 0:1; // (8)

					if (j !== 0) {
						board[i+1][j-1] += (board[i+1][j-1] > 8) ? 0:1; // (7)
					}
					if (j !== size - 1) {
						board[i+1][j+1] += (board[i+1][j+1] > 8) ? 0:1; // (9)
					}
				}
				if (j !== 0) {
					board[i][j-1] += (board[i][j-1] > 8) ? 0:1; // (4)
				}
				if (j !== size - 1) {
					board[i][j+1] += (board[i][j+1] > 8) ? 0:1; // (6)
				}
			}
		}
	}
}