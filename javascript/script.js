var initiativeBackup = ''
var nameBackup = ''
var hitpointsBackup = ''
var armorClassBackup = ''
var dataInfoBackup = ''
var initiativeUpdate = ''
var sortOrderReversal = 'true'
var rowColourBackup = ''
var rowBackup = '';
var numberOfRows = [];
var backupArray = [];
var redoArray = [];
var arraySwap;

//Function to enable tooltips.

$(function() {
	$('[data-toggle="tooltip"]').tooltip()
});

//Function to enable popovers.

$(function() {
	$('[data-toggle="popover"]').popover()
});

//Function to autosort table.

function sort() {
	if (sortOrderReversal == 'false') {
			var tb = $('tbody');
			var rows = tb.find('tr');
			rows.sort(function (a, b) {
				var keyA = $(a).attr('data-info');
				var keyB = $(b).attr('data-info');
				return keyA - keyB;
			});
			$.each(rows, function (index, row) {
				tb.append(row);
			});
	} else {
		var tb = $('tbody');
		var rows = tb.find('tr');
		rows.sort(function (a, b) {
			var keyA = $(a).attr('data-info');
			var keyB = $(b).attr('data-info');
			return keyB - keyA;
		});
		$.each(rows, function (index, row) {
			tb.append(row);
		});
	};
};

//Function for adding new rows in the Initiative Table.

$('#addInitRowButton').on('click', function() {
	var initiative = $('#newInitiativeRow .trackerInit input').val();
	var name = $('#newInitiativeRow .trackerName input').val();
	var hitpoints = $('#newInitiativeRow .trackerHP input').val();
	var armorclass = $('#newInitiativeRow .trackerAC input').val();
	var rowNumber = numberOfRows.length+1;
	numberOfRows.push(rowNumber);

	$('.templateInitiativeRow')
		.clone(true)
		.addClass('initiativeRow')
		.insertAfter('.templateInitiativeRow')
		.removeClass('templateInitiativeRow')
		.removeClass('hidden')
		.attr('data-info', initiative)
		.attr('data-row', numberOfRows.length)
		.find('.trackerInit')
		.html(initiative)
		.next('.trackerName')
		.html(name)
		.next('.trackerHP')
		.html(hitpoints)
		.next('.trackerAC')
		.html(armorclass)
		.prepend;
	$(this).closest('tr').find('input').val('');
	sort();
	
	//Part of function for adding values from new rows to the backup array.
	
	var replaceHolder = document.getElementById("tbody").children;
	for (var x = 0; x < replaceHolder.length; x++) {
		if (replaceHolder[x].getAttribute('data-row') == rowNumber) {
			for (var i = 0; i < replaceHolder[x].children.length; i++) {
				if (!replaceHolder[x].children[i].classList.contains("noDownload")) {
					if (!replaceHolder[x].children[i].classList.contains("colourTrackingCell")) {
						var holder = replaceHolder[x].children[i].textContent;
						var row = replaceHolder[x].children[i].closest("tr").dataset.row;
						var cell = replaceHolder[x].children[i].classList[0];
						var backup = new change(holder, row, cell);
						backupArray.unshift(backup);
					}
				}
			}
		}
	}
});	

//Function for removing rows in the Initiative Table.

$('.removeInitRowButton').on('click', function() {
	initiativeBackup = $(this).closest('tr').find('.trackerInit').text();
	nameBackup = $(this).closest('tr').find('.trackerName').text();
	hitpointsBackup = $(this).closest('tr').find('.trackerHP').text();
	armorClassBackup = $(this).closest('tr').find('.trackerAC').text();
	dataInfoBackup = $(this).closest('tr').attr('data-info');
	rowColourBackup = $(this).closest('tr').find('.trackerInit').css("background-color");
	rowBackup = this.closest('tr').dataset.row;
	for (var x = backupArray.length - 1; x >= 0; x--) {
		if (backupArray[x].row === rowBackup) {
			backupArray.splice(x, 1);	
		}
	};
	$(this).closest('.initiativeRow').remove();
	$('#undoButton').removeClass('hidden');
});

//Function for undoing deletion of a row.

$('#undoButton').on('click', function() {
	$('.templateInitiativeRow')
		.clone(true)
		.addClass('initiativeRow')
		.insertAfter('.templateInitiativeRow')
		.removeClass('templateInitiativeRow')
		.removeClass('hidden')
		.attr('data-info', dataInfoBackup)
		.attr('data-row', rowBackup)
		.find('.trackerInit')
		.html(initiativeBackup)
		.next('.trackerName')
		.html(nameBackup)
		.next('.trackerHP')
		.html(hitpointsBackup)
		.next('.trackerAC')
		.html(armorClassBackup)
		.closest('tr')
		.find('.trackerInit')
		.css('background-color', rowColourBackup)
		.next('.trackerName')
		.css('background-color', rowColourBackup)
		.next('.trackerHP')
		.css('background-color', rowColourBackup)
		.next('.trackerAC')
		.css('background-color', rowColourBackup)
		.next('.trackerDamage')
		.css('background-color', rowColourBackup)
		.next('.trackerHealing')
		.css('background-color', rowColourBackup)
		.prepend;
	$('#undoButton').addClass('hidden');
	sort();
});

//Function for confirming when attempting to leave the page with any changes made.

$(function() {
	if ($('input').change(function() {
		$(window).on('beforeunload', function() {
			return confirm();
		});
	}));
	
	if ($('.editable').blur(function() {
		$(window).on('beforeunload', function() {
			return confirm();
		});
	}));
});

//Function to prevent non-numeric characters being added into editable number cells.

$(".editableNum").keypress(function (e) {
	if (isNaN(String.fromCharCode(e.which))) e.preventDefault();
});

//Function to blur editable cells when Enter key is pressed.

$(".editable").keypress(function (e) {
	if (e.which == 13) {
		$(this).blur();
	}
});

//Function for subtracting health from total when a number is entered into the Damage cell.

$('.trackerDamage').on('input').blur(function() {
	var damage = $(this).text();
	var damagehp = $(this).prevAll('.trackerHP').text();
	var damagetohp = damagehp - damage;
	$(this).prevAll('.trackerHP').html(damagetohp);
	if (this.textContent !== "") {
		var holder = this.closest("tr").querySelector('.trackerHP').textContent;
		var row = this.closest("tr").dataset.row;
		var cell = this.closest("tr").querySelector('.trackerHP').classList[0];
		var backup = new change(holder, row, cell);
		backupArray.unshift(backup);
	};
	$(this).text('');
});

//Function for adding health to total when a number is entered into the Healing cell.

$('.trackerHealing').on('input').blur(function() {
	var healing = $(this).text();
	var healinghp = $(this).prevAll('.trackerHP').text();
	var healingtohp = Number(healinghp) + Number(healing);
	$(this).prevAll('.trackerHP').html(healingtohp);
	if (this.textContent !== "") {
		var holder = this.closest("tr").querySelector('.trackerHP').textContent;
		var row = this.closest("tr").dataset.row;
		var cell = this.closest("tr").querySelector('.trackerHP').classList[0];
		var backup = new change(holder, row, cell);
		backupArray.unshift(backup);
	};
	$(this).text('');
});

//Function for sorting the table based on Initiative value when Initiative cells are blurred.

$('.trackerInitUpdate').blur(function() {
	initiativeUpdate = $(this).closest('tr').find('.trackerInit').text();
	$(this).closest('.initiativeRow').attr('data-info', initiativeUpdate);
	sort();
});

//Function for reversing the Sort Order.

$('#reverseSortOrderToggle').on('click', function() {
	sort();
	if(sortOrderReversal = 'false') {
		sortOrderReversal == 'true';
	} else {
		sortOrderReversal == 'false';
	}
});

//Function for changing the colour of a row when the colour selector is used.

$('.colourCode1').on('click', function() {
	$('table').find(`[data-info='clicked']`)
		.closest('tr')
		.children('.editable')
		.css('background-color', '#C91010')
		.css('color', '#ffffff')
		.closest('tr')
		.find('.colourTrackingCell')
		.html('1');
});

$('.colourCode2').on('click', function() {
	$('table').find(`[data-info='clicked']`)
		.closest('tr')
		.children('.editable')
		.css('background-color', '#1076C9')
		.css('color', '#ffffff')
		.closest('tr')
		.find('.colourTrackingCell')
		.html('2');
});

$('.colourCode3').on('click', function() {
	$('table').find(`[data-info='clicked']`)
		.closest('tr')
		.children('.editable')
		.css('background-color', '#2FC910')
		.css('color', '#ffffff')
		.closest('tr')
		.find('.colourTrackingCell')
		.html('3');
});

$('.colourCode4').on('click', function() {
	$('table').find(`[data-info='clicked']`)
		.closest('tr')
		.children('.editable')
		.css('background-color', '#C97310')
		.css('color', '#ffffff')
		.closest('tr')
		.find('.colourTrackingCell')
		.html('4');
});

$('.colourCode5').on('click', function() {
	$('table').find(`[data-info='clicked']`)
		.closest('tr')
		.children('.editable')
		.css('background-color', '#9510C9')
		.css('color', '#ffffff')
		.closest('tr')
		.find('.colourTrackingCell')
		.html('5');
});

$('.colourCode6').on('click', function() {
	$('table').find(`[data-info='clicked']`)
		.closest('tr')
		.children('.editable')
		.css('background-color', '#EB75E1')
		.css('color', '#ffffff')
		.closest('tr')
		.find('.colourTrackingCell')
		.html('6');
});

$('.colourCode7').on('click', function() {
	$('table').find(`[data-info='clicked']`)
		.closest('tr')
		.children('.editable')
		.css('background-color', '#E5EB75')
		.css('color', '#000000')
		.closest('tr')
		.find('.colourTrackingCell')
		.html('7');
});

$('.colourCodeReset').on('click', function() {
	$('table').find(`[data-info='clicked']`)
		.closest('tr')
		.children('.editable')
		.css('background-color', '#252830')
		.css('color', '#ffffff')
		.closest('tr')
		.find('.colourTrackingCell')
		.html('0');
});

//Function for toggling the colour selector button on.

$('#colourCodingToggle').on('click', function() {
	if ($('.colourSelectorButton').hasClass("hidden")) {
		$('.colourSelectorButton').removeClass('hidden');
	} else {
		$('.colourSelectorButton').addClass('hidden');
	};
});

//Function for activating the Colour Selector Modal.

$('.colourSelectorButton').on('click', function() {
	$(this).attr('data-info', 'clicked')
	$('.coloursModal').modal('toggle');
});

$('.coloursModal').on('hidden.bs.modal', function (e) {
	$('table').find(`[data-info='clicked']`)
		.removeAttr('data-info', 'clicked');
});

//Function for activating the Help modal.

$('#helpToggle').on('click', function() {
	$('.helpModal').modal('toggle');
});

//Function for downloading table data as a CSV file.

$('#saveButton').click(function() {
	var titles = [];
	var data = [];
	$('#initiativeTrackerTable').find('tr').each(function() {
		if ($(this).attr("data-info") == "") {
			$(this).closest('.initiativeRow').attr('data-info', '0').find('.trackerInit').html('0');
		};
	});
	$('#initiativeTrackerTable th:not(.noDownload)').each(function() {
		titles.push($(this).text());
	});
	$('#initiativeTrackerTable td:not(.noDownload)').each(function() {
		data.push($(this).text());
	});

	var CSVString = prepCSVRow(titles, titles.length, '');
	CSVString = prepCSVRow(data, titles.length, CSVString);

	var downloadLink = document.createElement("a");
	var blob = new Blob(["\ufeff", CSVString]);
	var url = URL.createObjectURL(blob);
	downloadLink.href = url;
	downloadLink.download = "data.csv";

	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);

});

function prepCSVRow(arr, columnCount, initial) {
	var row = '';
	var delimeter = ',';
	var newLine = '\r\n';
	function splitArray(_arr, _count) {
		var splitted = [];
		var result = [];
		_arr.forEach(function (item, idx) {
			if ((idx + 1) % _count === 0) {
				splitted.push(item);
				result.push(splitted);
				splitted = [];
			} else {
				splitted.push(item);
			}
		});
		return result;
	};
	var plainArr = splitArray(arr, columnCount);
	plainArr.forEach(function (arrItem) {
		arrItem.forEach(function (item, idx) {
			row += item + ((idx + 1) === arrItem.length ? '' : delimeter);
		});
		row += newLine;
	});
	return initial + row;
};

//Function for loading table data from a csv file.

$(document).ready(function() {
	var loadedInitiative = ''
	var loadedName = ''
	var loadedHP = ''
	var loadedAC = ''
	var loadedColour = ''
	document.getElementById('fileLoad').addEventListener('change', upload, false);
	
	function browserSupportFileUpload() {
		var isCompatible = false;
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			isCompatible = true;
		}
		return isCompatible;
	};
	
	function upload(evt) {
		if (!browserSupportFileUpload()) {
			alert('The File APIs are not fully supported in this browser! Please update your browser version.');
		} else {
			var data = null;
			var file = evt.target.files[0];
			var reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function (event) {
				var csvData = event.target.result;
				data = $.csv.toArrays(csvData);
				if (data && data.length > 0) {
					var table = arrayToTable(data, {
						thead: true,
						attrs: { class: 'table' }
					})
					$('#initiativeTrackerTable').append(table);
					$(table).addClass('loadedTable')
						.addClass('hidden')
					$('.loadedTable').find('th')
						.closest('tr').remove();
					$('.loadedTable').find('tr')
						.addClass('loadedRow');
					$('.loadedRow').each(function() {
						loadedColour = $('.loadedRow').eq(0)
							.find('td').eq(0)
							.text();
						loadedInitiative = $('.loadedRow').eq(0)
							.find('td').eq(1)
							.text();
						loadedName = $('.loadedRow').eq(0)
							.find('td').eq(2)
							.text();
						loadedHP = $('.loadedRow').eq(0)
							.find('td').eq(3)
							.text();
						loadedAC = $('.loadedRow').eq(0)
							.find('td').eq(4)
							.text();
						$('.loadedRow').eq(0)
							.closest('tr')
							.remove();
						$('.templateInitiativeRow')
							.clone(true)
							.addClass('initiativeRow')
							.insertAfter('.templateInitiativeRow')
							.removeClass('templateInitiativeRow')
							.removeClass('hidden')
							.attr('data-info', loadedInitiative)
							.find('.trackerInit')
							.html(loadedInitiative)
							.next('.trackerName')
							.html(loadedName)
							.next('.trackerHP')
							.html(loadedHP)
							.next('.trackerAC')
							.html(loadedAC)
							.closest('tr')
							.find('.colourTrackingCell')
							.html(loadedColour)
							.prepend;
							
						if (loadedColour == '1') {
							$('.trackerInit').eq(1)
								.closest('tr')
								.children('.editable')
								.css('background-color', '#C91010')
								.css('color', '#ffffff')
								.closest('tr')
								.find('.colourTrackingCell')
								.html('1');
						};
						if (loadedColour == '2') {
							$('.trackerInit').eq(1)
								.closest('tr')
								.children('.editable')
								.css('background-color', '#1076C9')
								.css('color', '#ffffff')
								.closest('tr')
								.find('.colourTrackingCell')
								.html('2');
						};
						if (loadedColour == '3') {
							$('.trackerInit').eq(1)
								.closest('tr')
								.children('.editable')
								.css('background-color', '#2FC910')
								.css('color', '#ffffff')
								.closest('tr')
								.find('.colourTrackingCell')
								.html('3');
						};
						if (loadedColour == '4') {
							$('.trackerInit').eq(1)
								.closest('tr')
								.children('.editable')
								.css('background-color', '#C97310')
								.css('color', '#ffffff')
								.closest('tr')
								.find('.colourTrackingCell')
								.html('4');
						};
						if (loadedColour == '5') {
							$('.trackerInit').eq(1)
								.closest('tr')
								.children('.editable')
								.css('background-color', '#9510C9')
								.css('color', '#ffffff')
								.closest('tr')
								.find('.colourTrackingCell')
								.html('5');
						};
						if (loadedColour == '6') {
							$('.trackerInit').eq(1)
								.closest('tr')
								.children('.editable')
								.css('background-color', '#EB75E1')
								.css('color', '#ffffff')
								.closest('tr')
								.find('.colourTrackingCell')
								.html('6');
						};
						if (loadedColour == '7') {
							$('.trackerInit').eq(1)
								.closest('tr')
								.children('.editable')
								.css('background-color', '#E5EB75')
								.css('color', '#000000')
								.closest('tr')
								.find('.colourTrackingCell')
								.html('7');
						};
						if (loadedColour == '0') {
							$('.trackerInit').eq(1)
								.closest('tr')
								.children('.editable')
								.css('background-color', '#252830')
								.css('color', '#ffffff')
								.closest('tr')
								.find('.colourTrackingCell')
								.html('0');
						};
					});

					$('#initiativeTrackerTable').find('tr').each(function() {
						if ($(this).attr("data-info") == "") {
							$(this).closest('tr').remove();
						};
					});
					sort();
				} else {
					alert('No data to import!');
				}
			};
			
			reader.onerror = function() {
				alert('Unable to read ' + file.fileName);
			};
		}
	}
});

//Function for dismissing popovers when focus is changed.

$('.popover-dismiss').popover({
	trigger: 'focus'
});

//Function for preventing browser default of Ctrl+z, Ctrl+Shift+z & Ctrl+y.

$(document).keydown(function(event) {
	switch (event.which) {
		case 90:
			if (event.shiftKey && event.ctrlKey) {
			// Ctrl+Shift+z
				event.preventDefault();
				redo();
			}
			else if (event.ctrlKey) {
			// Ctrl+z
				event.preventDefault();
				undo();
			}
			break;
		case 89:
			if (event.ctrlKey) {
			// Ctrl+y
				event.preventDefault();
				redo();
			}
			break;
	}
});

//Function for backing up previous actions to undo/redo.

class change {
	constructor(content, row, cell) {
		this.content = content;
		this.row = row;
		this.cell = cell;
	}
}

(function() {
	$('.editable').on('focus', function() {
		oldData = this.textContent;
		return oldData;
	});
	
	$('.editable').on('blur', (function() {
		if(!this.classList.contains("noDownload")) {
			var data = this.textContent;
			if(data !== oldData) {
				var holder = this.textContent;
				var row = this.closest("tr").dataset.row;
				var cell = this.classList[0];
				var backup = new change(holder, row, cell);
				backupArray.unshift(backup);
				redoArray = [];
			}
		}
	}));
})();

//Function for undoing changes.

function undo() {
	var holder = backupArray[0];
	var replaceRow;
	for (x = 1; x < backupArray.length; x++) {
		if (backupArray[x].row == holder.row) {
			if (backupArray[x].cell == holder.cell) {
				var replace = backupArray[x];
				var replaceHolder = document.getElementById("tbody").children;
				for (var x = 0; x < replaceHolder.length; x++) {
					if (replaceHolder[x].getAttribute('data-row') == replace.row) {
						replaceRow = replaceHolder[x];
					}
				}
				var replaceChild = replaceRow.children;
				for (var i = 0; i < replaceChild.length; i++) {
					if (replaceChild[i].classList[0] == replace.cell) {
						var textReplace = replaceChild[i];
						textReplace.classList.remove("animateUndo");
						window.requestAnimationFrame(function(time) {
    						window.requestAnimationFrame(function(time) {
								textReplace.classList.add("animateUndo");
							});
						});
						textReplace.textContent = replace.content;
						textReplace.addEventListener("webkitAnimationEnd", function() {
							textReplace.classList.remove("animateUndo");
						})
						textReplace.addEventListener("animationend", function() {
							textReplace.classList.remove("animateUndo");
						})
						arraySwap = backupArray.splice(0, 1);
						redoArray.unshift(arraySwap[0]);
					}
				}
				break;
			}
		}
	}
}

//Function for redoing undone changes.

function redo() {
	var holder = redoArray[0];
	var replaceRow;
	for (x = 0; x < redoArray.length; x++) {
		if (redoArray[x].row == holder.row) {
			if (redoArray[x].cell == holder.cell) {
				var replace = redoArray[x];
				var replaceHolder = document.getElementById("tbody").children;
				for (var x = 0; x < replaceHolder.length; x++) {
					if (replaceHolder[x].getAttribute('data-row') == replace.row) {
						replaceRow = replaceHolder[x];
					}
				}
				var replaceChild = replaceRow.children;
				for (var i = 0; i < replaceChild.length; i++) {
					if (replaceChild[i].classList[0] == replace.cell) {
						var textReplace = replaceChild[i];
						textReplace.classList.remove("animateRedo");
						window.requestAnimationFrame(function() {
    						window.requestAnimationFrame(function() {
								textReplace.classList.add("animateRedo");
							});
						});
						textReplace.textContent = replace.content;
						textReplace.addEventListener("webkitAnimationEnd", function() {
							textReplace.classList.remove("animateRedo");
						})
						textReplace.addEventListener("animationend", function() {
							textReplace.classList.remove("animateRedo");
						})
						arraySwap = redoArray.splice(0, 1);
						backupArray.unshift(arraySwap[0]);
					}
				}
			break;
			}
		}
	}
}

//Function for activating undo function when clicking on the undo button on the toolbar.

$('#navUndoButton').on('click', undo);

//Function for activating redo function when clicking on the redo button on the toolbar.

$('#navRedoButton').on('click', redo);