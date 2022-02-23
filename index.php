<!doctype html>
<html lang="en">

	<head>	
		<meta charset="utf-8">
		<meta http-equiv="Content-type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
		
		<link rel="stylesheet" type="text/css" href="CSS/stylesheet.css" media="screen">
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<link href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto&display=swap" rel="stylesheet">
		<script src="https://kit.fontawesome.com/1905ae2f44.js"></script>

		<title>D&D Activity Tracker</title>	
	</head>
  
	<body>
	
		<!-- Toolbar -->
		<div class="topnav">
			<a href="updates" target="_blank"><i class="fas fa-file-alt"></i>  What's New?</a>
			<a tabindex="0" id="helpToggle"><i class="far fa-question-circle"></i>  Help</a>
			<a id="loadButton"><i class="fas fa-file-upload"></i><label>  Load<input type="file" id="fileLoad" accept=".csv" hidden></label></a>
			<a id="saveButton"><i class="fas fa-file-download"></i>  Save</a>
			<a name="colourCodingToggle" id="colourCodingToggle"><i class="fas fa-palette"></i>  Toggle Colour Coding</a>			
			<a name="sortOrderToggle" id="reverseSortOrderToggle"><i class="fas fa-sort-numeric-down-alt" id="sortIconDown"></i><i class="fas fa-sort-numeric-up hidden" id="sortIconUp"></i>  Change Sorting Order</a>
			<a name="undoButton" id="navUndoButton"><i class="fas fa-undo-alt"></i>  Undo</a>
			<a name="redoButton" id="navRedoButton"><i class="fas fa-redo-alt"></i>  Redo</a>
		</div>
		<!-- Tracker table -->
		<div id="initiativeDiv" class="container-fluid">
			<h1>Initiative Tracker</h1>
			<table id="initiativeTrackerTable" class="container">	
				<thead>
					<tr>
						<th class="colourTrackingCell hidden"></th>
						<th class="extrasCell noDownload"></th>
						<th class="tracker"><span class="full-text">Initiative</span><span class="short-text">Init</span></th>
						<th class="trackerName">Name</th>
						<th class="tracker"><span class="full-text">Hit Points</span><span class="short-text">HP</span></th>
						<th class="tracker"><span class="full-text">Armor Class</span><span class="short-text">AC</span></th>
						<th class="tracker noDownload"><span class="full-text">Damage</span><span class="short-text">Dam</span></th>
						<th class="tracker noDownload"><span class="full-text">Healing</span><span class="short-text">Heal</span></th>
						<th class="buttonCell noDownload" id="undoButtonCell"><button type="button" class="btn btn-info hidden" id="undoButton">Undo</button></th>
					</tr>
				</thead>
				<tbody id="tbody">	
					<!-- Template row (hidden - copied whenever new rows are needed) -->
					<tr class="templateInitiativeRow hidden">
						<td class="colourTrackingCell hidden">0</td>
						<td class="extrasCell noDownload"><button class="btn btn-warning btn-sm colourSelectorButton hidden">Colours</button></td>
						<td class="trackerInit editable editableNum trackerInitUpdate" contenteditable></td>
						<td class="trackerName editable" contenteditable></td>
						<td class="trackerHP editable editableNum" contenteditable></td>
						<td class="trackerAC editable editableNum" contenteditable></td>
						<td class="trackerDamage editable editableNum noDownload" contenteditable></td>
						<td class="trackerHealing editable editableNum noDownload" contenteditable></td>
						<td class="buttonCell noDownload"><button type="button" class="btn btn-danger removeInitRowButton">Remove</button></td>
					</tr>
					<!-- Row for entering information to add rows -->
					<tr id="newInitiativeRow">
						<td class="colourTrackingCell hidden"></td>
						<td class="extrasCell noDownload"></td>
						<td class="trackerInit"><input type="number" min="0"></td>
						<td class="trackerName"><input type="text" ></td>
						<td class="trackerHP"><input type="number" min="0"></td>
						<td class="trackerAC"><input type="number" min="0"></td>
						<td class="trackerDamage noDownload"></td>
						<td class="trackerHealing noDownload"></td>
						<td class="buttonCell noDownload" id="newRowButtonCell"><button type="button" class="btn btn-secondary" id="addInitRowButton">Add</button></td>
					</tr>
				</tbody>
			</table>
		</div>
		
		<!-- Colour selector modal -->
		<div class="modal coloursModal" tabindex="-1" role="dialog" aria-labelledby="ColoursModal" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Colours</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">					
							<span class="white" aria-hidden="true">&times;</span>					
						</button>					
					</div>				
					<div class="modal-body">
						<div class="colourSelectorContainer">							
							<div class="colourSelector colourCode1"></div>
							<div class="colourSelector colourCode2"></div>
							<div class="colourSelector colourCode3"></div>
							<div class="colourSelector colourCode4"></div>
							<div class="colourSelector colourCode5"></div>
							<div class="colourSelector colourCode6"></div>
							<div class="colourSelector colourCode7"></div>
							<i class="fas fa-times colourCodeReset"></i>								
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Help modal-->
		<div class="modal helpModal" tabindex="-1" role="dialog" aria-labelledby="HelpModal" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" role="document">
				<div class="modal-content" id="helpModal">
					<div class="modal-header">
						<h5 class="modal-title">Help</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">					
							<span class="white" aria-hidden="true">&times;</span>					
						</button>					
					</div>				
					<div class="modal-body">
						<div class="helpContainer">							
							<ul>
								<li>Add rows to the tracker by entering information into the bottom row and pressing the Add button.</li>
								<li>When a row is deleted an Undo button will appear which can restore the last deleted row.</li>
								<li>The Tracker will automatically sort rows based on the number entered into the Initiative column.</li>
								<li>Entering a number into the Damage column will automatically subtract that amount from the Hit Points total on the same row.</li>
								<li>Once you have added a row, you can edit any values in it freely.</li>
								<li>The 'Change Sorting Order' option will reverse the order that the tracker auto-sorts initiative, allowing you to switch between an assigned initiative order number (1 being first) and a raw initiative roll (20+ being first).</li>
								<li>The 'Toggle Colour Coding' option will activate a choice of colours to change added rows to. These colours match the colours that can be assigned to tokens on Roll20.net. Chosen colours will remain if you later untoggle this option.</li>
								<li>Use the Save button to save a .csv file containing the tracker contents to your local machine, which you can then load back into the tracker in the future with the Load button.</li>
								<li>You can undo (and redo) changes made in the tracker fields, including damage and healing, by using the buttons in the top left or using keyboard shortcuts.</li>
								<li>If anything is not working properly, please update your browser.</p>
							</ul>
						</div>					
					</div>							
				</div>
			</div>
		</div>
	
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
	<script src="javascript/jquery.csv.js"></script>
	<script src="javascript/arrayToTable.js"></script>
	<script src="javascript/script.js"></script>

	</body>

</html>