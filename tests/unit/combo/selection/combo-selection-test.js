QUnit.module("igCombo selection unit tests", {
	divTag: '<div></div>'
});

QUnit.test('[ID1] Item selection', function (assert) {
	assert.expect(35);

	var $combo = $.ig.TestUtil.appendToFixture(this.divTag, { id: "combo-selitem" }),
		$hiddenInput, $itemToSel, $input, $selectedItems, $items,
		selectionChangingFires = 0,
		selectionChangedFires = 0,
		expInputVal = 'John Smith',
		expHiddenInputVal = '1',
		dataSource = [{ ID: 1, Name: "John Smith" },
		{ ID: 2, Name: "Mary Johnson" },
		{ ID: 3, Name: "Bob Ferguson" }];

	$combo.igCombo({
		dataSource: dataSource,
		textKey: 'Name',
		valueKey: 'ID',
		animationShowDuration: 0,
		animationHideDuration: 0,
		selectionChanging: function (event, args) { selectionChangingFires++; },
		selectionChanged: function (event, args) { selectionChangedFires++; },
		initialSelectedItems: [{ index: 1 }]
	});

	$input = $combo.find('.ui-igcombo-field');
	$hiddenInput = $combo.find('.ui-igcombo-hidden-field');
	$itemToSel = $combo.igCombo('dropDown').find('.ui-igcombo-listitem').first();
	$items = $combo.igCombo('dropDown').find('li');

	// Verify initialSelectedItems
	assert.strictEqual($input.val(), "Mary Johnson", 'Input value is incorrect');
	assert.strictEqual($hiddenInput.val(), "2", 'Hidden input value is incorrect');

	// Select item
	$combo.igCombo('select', $itemToSel);

	assert.strictEqual($input.val(), expInputVal, 'Input value is incorrect');
	assert.strictEqual($hiddenInput.val(), expHiddenInputVal, 'Hidden input value is incorrect');

	$selectedItems = $combo.igCombo('selectedItems');
	assert.strictEqual($selectedItems.length, 1, 'Selected items count is not correct');
	assert.strictEqual($selectedItems[0].data.ID, 1, 'Item data is not correct');
	assert.ok($combo.igCombo('isIndexSelected', 0), 'Item should be selected');
	assert.ok($combo.igCombo('isValueSelected', 1), 'Item should be selected');
	assert.strictEqual(selectionChangingFires, 0, 'selectionChanging event should not fire');
	assert.strictEqual(selectionChangedFires, 0, 'selectionChanged event should not fire');

	// deselect item
	$combo.igCombo('deselect');
	assert.strictEqual($input.val(), "", 'Input value is incorrect');
	assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');

	$selectedItems = $combo.igCombo('selectedItems');
	assert.strictEqual($selectedItems, null, 'Selected items count is not correct');
	assert.notOk($combo.igCombo('isIndexSelected', 0), 'Item should not be selected');
	assert.notOk($combo.igCombo('isValueSelected', 1), 'Item should not be selected');
	assert.strictEqual(selectionChangingFires, 0, 'selectionChanging event should not fire');
	assert.strictEqual(selectionChangedFires, 0, 'selectionChanged event should not fire');

	// Select item by index
	$combo.igCombo('index', 0);

	assert.strictEqual($input.val(), expInputVal, 'Input value is incorrect');
	assert.strictEqual($hiddenInput.val(), expHiddenInputVal, 'Hidden input value is incorrect');
	assert.strictEqual(selectionChangingFires, 0, 'selectionChanging event should not fire');
	assert.strictEqual(selectionChangedFires, 0, 'selectionChanged event should not fire 1');

	// deselect item by index
	$combo.igCombo('deselectByIndex', 0);
	assert.strictEqual($input.val(), "", 'Input value is incorrect');
	assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');
	assert.strictEqual(selectionChangingFires, 0, 'selectionChanging event should not fire');
	assert.strictEqual(selectionChangedFires, 0, 'selectionChanged event should not fire');

	// Select items by value
	$combo.igCombo('value', 1);

	assert.strictEqual($input.val(), expInputVal, 'Input value is incorrect');
	assert.strictEqual($hiddenInput.val(), expHiddenInputVal, 'Hidden input value is incorrect');
	assert.strictEqual(selectionChangingFires, 0, 'selectionChanging event should not fire');
	assert.strictEqual(selectionChangedFires, 0, 'selectionChanged event should not fire');

	// deselect item by value
	$combo.igCombo('deselectByValue', 3);
	assert.strictEqual($input.val(), expInputVal, 'Input value is incorrect');
	assert.strictEqual($hiddenInput.val(), expHiddenInputVal, 'Hidden input value is incorrect');
	assert.strictEqual(selectionChangingFires, 0, 'selectionChanging event should not fire');
	assert.strictEqual(selectionChangedFires, 0, 'selectionChanged event should not fire');

	// Get first selected item by value
	assert.strictEqual($item = $combo.igCombo('value'), 1, 'Item value is not correct');

	// Get first selected item by index
	assert.strictEqual($item = $combo.igCombo('index'), 0, 'Item index is not correct');
});

QUnit.test('[ID2] Drop down mode', function (assert) {
	assert.expect(6);

	var $input, $item,
		$combo = $.ig.TestUtil.appendToFixture(this.divTag, { id: "combo-ddmode" }),
		itemHeight = 29,
		border = 1,
		dropDownExpHeight = 3 * itemHeight + border,
		listItemExpWidth = 198,
		listItemExpHeight = itemHeight,
		listItemExpPosLeft = $combo.offset().left + 1,
		listItemExpPosTop = $combo.offset().top + 30,
		click = $.Event('click'),
		mouseEnter = $.Event('mouseenter'),
		mouseLeave = $.Event('mouseleave'),
		dataSource = [{ ID: 1, Name: "John Smith" },
		{ ID: 2, Name: "Mary Johnson" },
		{ ID: 3, Name: "Bob Ferguson" }];

	$combo.igCombo({
		width: 200,
		height: 30,
		dataSource: dataSource,
		mode: 'dropdown',
		animationShowDuration: 0,
		animationHideDuration: 0,
		dropDownAttachedToBody: false
	});

	$input = $combo.find('.ui-igcombo-field');
	$dropDown = $combo.find('.ui-igcombo-dropdown');
	$item = $combo.find('li').eq(0);

	assert.strictEqual($input.attr('readonly'), 'readonly', 'Readonly attribute was not applied');
	assert.strictEqual($input.hasClass('ui-unselectable'), true, 'Unselectable class was not applied');

	$input.trigger(click); // click on input
	// Adding tolerance for inconsistencies between the running engine and real browsers
	assert.ok(dropDownExpHeight - 6 <= $dropDown.outerHeight() && dropDownExpHeight + 6 >= $dropDown.outerHeight(), dropDownExpHeight, 'Drop down height is incorrect')
	//strictEqual($dropDown.outerHeight(), dropDownExpHeight, 'Drop down height is incorrect');

	$item.trigger(mouseEnter); // Hover item
	assert.ok($item.hasClass('ui-state-hover'), 'Class ui-state-hover was not applied to list item 0');

	$item.trigger(mouseLeave);
	assert.notOk($item.hasClass('ui-state-hover'), 'Class ui-state-hover was not applied to list item 0');

	$input.trigger(click); // click on input
	assert.strictEqual($dropDown.outerHeight(), 0, 'Drop down height is incorrect');
});

QUnit.test('[ID3] Readonly mode', function (assert) {
	assert.expect(6);

	var $input, $dropDown, $hiddenInput,
		$combo = $.ig.TestUtil.appendToFixture(this.divTag, { id: "combo-romode" }),
		click = $.Event('click'),
		dataSource = [{ ID: 1, Name: "John Smith" },
		{ ID: 2, Name: "Mary Johnson" },
		{ ID: 3, Name: "Bob Ferguson" }];

	$combo.igCombo({
		dataSource: dataSource,
		mode: 'readonly',
		animationShowDuration: 0,
		animationHideDuration: 0
	});

	$input = $combo.find('.ui-igcombo-field');
	$hiddenInput = $combo.find('.ui-igcombo-hidden-field');
	$button = $combo.find('.ui-igcombo-button');

	assert.strictEqual($input.attr('readonly'), 'readonly', 'Readonly attribute was not applied');
	assert.strictEqual($input.hasClass('ui-unselectable'), true, 'Unselectable class was not applied');

	assert.strictEqual($input.val(), "1", 'Input value is incorrect');
	assert.strictEqual($hiddenInput.val(), "1", 'Hidden input value is incorrect');

	$input.trigger(click); // click on input
	$dropDown = $combo.igCombo('dropDown');
	assert.strictEqual($dropDown.outerHeight(), 0, 'Drop down should not be opened');

	$button.trigger(click); // click on expand button
	$dropDown = $combo.igCombo('dropDown');
	assert.strictEqual($dropDown.outerHeight(), 0, 'Drop down should not be opened');
});

QUnit.test('[ID4] Readonlylist mode', function (assert) {
	assert.expect(12);

	var $input, $item, $item1, $hiddenInput, $dropDown,
		$combo = $.ig.TestUtil.appendToFixture(this.divTag, { id: "combo-rolmode" }),
		listItemExpWidth = 198,
		listItemExpHeight = 29,
		listItemExpPosLeft = $combo.offset().left + 1,
		listItemExpPosTop = $combo.offset().top + 30,
		dropDownExpHeight = 3 * listItemExpHeight + 1,
		click = $.Event('click'),
		mouseEnter = $.Event('mouseenter'),
		mouseLeave = $.Event('mouseleave'),
		dataSource = [{ ID: 1, Name: "John Smith" },
		{ ID: 2, Name: "Mary Johnson" },
		{ ID: 3, Name: "Bob Ferguson" }];

	$combo.igCombo({
		width: 200,
		height: 30,
		dataSource: dataSource,
		dropDownOrientation: "bottom",
		mode: 'readonlylist',
		animationShowDuration: 0,
		animationHideDuration: 0,
		dropDownAttachedToBody: false
	});

	$input = $combo.find('.ui-igcombo-field');
	$dropDown = $combo.find('.ui-igcombo-dropdown');
	$hiddenInput = $combo.find('.ui-igcombo-hidden-field');
	$item = $combo.find('li').eq(0);
	$item1 = $combo.find('li').eq(1);

	assert.strictEqual($input.attr('readonly'), 'readonly', 'Readonly attribute was not applied');
	assert.strictEqual($input.hasClass('ui-unselectable'), true, 'Unselectable class was not applied');

	$input.trigger(click); // click on input
	// Adding tolerance for inconsistencies between the running engine and real browsers
	assert.ok(dropDownExpHeight - 6 <= $dropDown.outerHeight() && dropDownExpHeight + 6 >= $dropDown.outerHeight(), dropDownExpHeight, 'Drop down height is incorrect')
	//strictEqual($dropDown.outerHeight(), dropDownExpHeight, 'Drop down height is incorrect');

	// Verify first item is selected
	assert.ok($item.hasClass('ui-state-active'), 'Item should be selected');
	assert.strictEqual($input.val(), "1", 'Input value is incorrect');
	assert.strictEqual($hiddenInput.val(), "1", 'Hidden input value is incorrect');

	$.ig.TestUtil.click($item1);

	assert.ok($item.hasClass('ui-state-active'), 'Item should be selected');
	assert.notOk($item1.hasClass('ui-state-active'), 'Item should not be selected');
	assert.strictEqual($input.val(), "1", 'Input value is incorrect');
	assert.strictEqual($hiddenInput.val(), "1", 'Hidden input value is incorrect');

	$item.trigger(mouseEnter);
	assert.notOk($item1.hasClass('ui-state-hover'), 'Class ui-state-hover was applied to list item 1');

	$item.trigger(mouseLeave);
	assert.notOk($item1.hasClass('ui-state-hover'), 'Class ui-state-hover was applied to list item 1');
});

QUnit.test('[ID5] Validation', function (assert) {
	assert.expect(6);

	var validator, validateResult,
		destroy = true,
		$combo = $.ig.TestUtil.appendToFixture(this.divTag, { id: "combo-validation" }),
		dataSource = [{ ID: 1, Name: "John Smith" },
		{ ID: 2, Name: "Mary Johnson" },
		{ ID: 3, Name: "Bob Ferguson" }];

	$combo.igCombo({
		dataSource: dataSource,
		textKey: 'Name',
		animationShowDuration: 0,
		animationHideDuration: 0,
		validatorOptions: {
			required: true
		}
	});

	// Validator
	validator = $combo.igCombo('validator');
	assert.ok($.type(validator) === "object", "Validator should be object.");
	assert.ok(validator.widgetName === "igValidator", "The type of Validator should be igValidator.");

	assert.strictEqual($combo.igCombo('validate'), false, 'Validation error message should be previewed');

	// Bug #209248 : Error when using igCombo with validatorOptions using closeDropDown()
	$combo.igCombo('openDropDown');
	$.ig.TestUtil.keyInteraction(40, $combo.igCombo("textInput"));
	$combo.igCombo('closeDropDown'); //causes validation
	assert.strictEqual(validator.isValid(), true, 'Validation should pass when closeDropDown() is called');

	validator = $combo.igCombo('validator', destroy);
	assert.ok(validator === null, "Validator should be null.");

	assert.strictEqual($combo.igCombo('validate'), null, 'Validate should return null when validator is destroyed');
});

QUnit.test('[ID6] Key navigation single selection', function (assert) {
	assert.expect(72);

	var $input, $items, $hiddenInput, $listItemsDiv,
		done = assert.async(),
		$combo = $.ig.TestUtil.appendToFixture(this.divTag, { id: "combo-keynav" }),
		selectionChangingFires = 0, selectionChangedFires = 0,
		dropDownOpenedFires = 0, dropDownOpeningFires = 0,
		dropDownClosedFires = 0, dropDownClosingFires = 0,
		dataSource = [{ ID: 1, Name: "John Smith" },
		{ ID: 2, Name: "Mary Johnson" },
		{ ID: 3, Name: "Bob Ferguson" },
		{ ID: 4, Name: "Tom Tomov" },
		{ ID: 5, Name: "Stewerd Matewson" },
		{ ID: 6, Name: "David Bengalski" }];

	$combo.igCombo({
		dataSource: dataSource,
		textKey: 'Name',
		animationShowDuration: 0,
		animationHideDuration: 0,
		selectionChanging: function (event, args) { selectionChangingFires++; },
		selectionChanged: function (event, args) { selectionChangedFires++; },
		dropDownOpening: function (event, args) { dropDownOpeningFires++; },
		dropDownOpened: function (event, args) { dropDownOpenedFires++; },
		dropDownClosing: function (event, args) { dropDownClosingFires++; },
		dropDownClosed: function (event, args) { dropDownClosedFires++; }
	});

	$hiddenInput = $combo.find('.ui-igcombo-hidden-field');
	$input = $combo.find('.ui-igcombo-field');
	$listItemsDiv = $combo.igCombo('dropDown');
	$items = $listItemsDiv.find('li');

	$.ig.TestUtil.keyInteraction(40, $input); // key down

	$.ig.TestUtil.wait(20).then(function () {
		assert.ok($listItemsDiv.height() > 0, 'List items list should  be visible');
		assert.strictEqual(1, dropDownOpeningFires, 'dropDownOpening event should fire');
		assert.strictEqual(1, dropDownOpenedFires, 'dropDownOpened event should fire');

		$.ig.TestUtil.keyInteraction(40, $input); // key down
		assert.strictEqual($input.val(), "John Smith", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "John Smith", 'Hidden input value is incorrect');
		assert.ok($items.eq(0).hasClass('ui-state-active'), 'Item should be selected by key down');
		assert.strictEqual(1, selectionChangingFires, 'selectionChanging event should fire');
		assert.strictEqual(1, selectionChangedFires, 'selectionChanged event should fire');

		$.ig.TestUtil.keyInteraction(38, $input); // key up
		return $.ig.TestUtil.wait(20);
	}).then(function () {
		assert.ok($items.eq(0).hasClass('ui-state-active'), 'Item should be selected by key up');
		assert.strictEqual($input.val(), "John Smith", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "John Smith", 'Hidden input value is incorrect');
		assert.strictEqual(1, selectionChangingFires, 'selectionChanging event should fire');
		assert.strictEqual(1, selectionChangedFires, 'selectionChanged event should fire');
		assert.strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible');
		assert.strictEqual(1, dropDownClosingFires, 'dropDownClosing event should fire');
		assert.strictEqual(1, dropDownClosedFires, 'dropDownClosed event should fire');

		$.ig.TestUtil.keyInteraction(40, $input, "altKey"); // alt + key down
		return $.ig.TestUtil.wait(20);
	}).then(function () {
		assert.ok($listItemsDiv.height() > 0, 'List items list should  be visible');
		assert.ok($items.eq(0).hasClass('ui-state-active'), 'Item should be selected');
		assert.strictEqual($input.val(), "John Smith", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "John Smith", 'Hidden input value is incorrect');
		assert.strictEqual(2, dropDownOpeningFires, 'dropDownOpening event should fire');
		assert.strictEqual(2, dropDownOpenedFires, 'dropDownOpened event should fire');

		$.ig.TestUtil.keyInteraction(40, $input); // key down
		$.ig.TestUtil.keyInteraction(40, $input); // key down
		assert.strictEqual($input.val(), "Bob Ferguson", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Bob Ferguson", 'Hidden input value is incorrect');
		assert.strictEqual(2, $combo.igCombo('activeIndex'), 'activ index is not correct');
		assert.ok($items.eq(2).hasClass('ui-state-active'), 'Item should be selected');
		assert.strictEqual(3, selectionChangingFires, 'selectionChanging event should fire');
		assert.strictEqual(3, selectionChangedFires, 'selectionChanged event should fire');
		assert.ok($listItemsDiv.height() > 0, 'List items list should  be visible');

		$.ig.TestUtil.keyInteraction(38, $input); // key up
		assert.strictEqual($input.val(), "Mary Johnson", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Mary Johnson", 'Hidden input value is incorrect');
		assert.strictEqual(1, $combo.igCombo('activeIndex'), 'activ index is not correct');
		assert.ok($items.eq(1).hasClass('ui-state-active'), 'Item was not selected by key down');
		assert.strictEqual(4, selectionChangingFires, 'selectionChanging event should fire');
		assert.strictEqual(4, selectionChangedFires, 'selectionChanged event should fire');
		assert.ok($listItemsDiv.height() > 0, 'List items list should be visible');

		$.ig.TestUtil.keyDownChar(36, $input, "ctrlKey"); // ctrl + home key
		$.ig.TestUtil.keyUpChar(36, $input, "ctrlKey"); // ctrl + home key
		assert.ok($items.eq(0).hasClass('ui-state-active'), 'Item was not selected by home key');
		assert.strictEqual($input.val(), "John Smith", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "John Smith", 'Hidden input value is incorrect');
		assert.strictEqual(5, selectionChangingFires, 'selectionChanging event should fire');
		assert.strictEqual(5, selectionChangedFires, 'selectionChanged event should fire');

		$.ig.TestUtil.keyDownChar(35, $input, "ctrlKey"); // ctrl + end key
		$.ig.TestUtil.keyUpChar(35, $input, "ctrlKey"); // ctrl + end key
		assert.ok($items.eq(5).hasClass('ui-state-active'), 'Item was not selected by end key');
		assert.strictEqual($input.val(), "David Bengalski", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "David Bengalski", 'Hidden input value is incorrect');
		assert.strictEqual(6, selectionChangingFires, 'selectionChanging event should fire');
		assert.strictEqual(6, selectionChangedFires, 'selectionChanged event should fire');

		var currentScrollPosition = $(window).scrollTop();
		$.ig.TestUtil.keyInteraction(33, $input); // page up key
		assert.ok($items.eq(0).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok(!$items.eq(5).hasClass('ui-state-active'), 'Item was not selected');
		assert.strictEqual($input.val(), "John Smith", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "John Smith", 'Hidden input value is incorrect');
		assert.strictEqual(7, selectionChangingFires, 'selectionChanging event should fire');
		assert.strictEqual(7, selectionChangedFires, 'selectionChanged event should fire');
		assert.ok(currentScrollPosition === $(window).scrollTop(), 'Page should not be scrolled up');

		$.ig.TestUtil.keyInteraction(34, $input); // page down key
		assert.ok($items.eq(5).hasClass('ui-state-active'), 'Item should be selected');
		assert.notOk($items.eq(0).hasClass('ui-state-active'), 'Item was not selected');
		assert.strictEqual($input.val(), "David Bengalski", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "David Bengalski", 'Hidden input value is incorrect');
		assert.strictEqual(8, selectionChangingFires, 'selectionChanging event should fire');
		assert.strictEqual(8, selectionChangedFires, 'selectionChanged event should fire');

		$.ig.TestUtil.keyInteraction(27, $input); // escape key
		assert.ok($items.eq(5).hasClass('ui-state-active'), 'Item should be selected');
		assert.strictEqual($input.val(), "David Bengalski", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "David Bengalski", 'Hidden input value is incorrect');

		$combo.igCombo('deselect', $items.eq(5)) // deselect item
		assert.notOk($items.eq(5).hasClass('ui-state-active'), 'Item should not be selected');
		assert.strictEqual($input.val(), "", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');

		$combo.igCombo('activeIndex', 1) // Set active index to be first item
		assert.strictEqual(1, $combo.igCombo('activeIndex'), 'active index is not correct');
		assert.ok($items.eq(1).hasClass('ui-igcombo-item-in-focus'), 'Item should be active');

		$.ig.TestUtil.keyInteraction(38, $input, "altKey"); // alt + arrow up
		return $.ig.TestUtil.wait(50);
	}).then(function () {
		assert.strictEqual($input.val(), "", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');
		assert.strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible');
		assert.strictEqual(2, dropDownClosingFires, 'dropDownClosing event should fire');
		assert.strictEqual(2, dropDownClosedFires, 'dropDownClosed event should fire');
		done();
	}).catch(function (er) {
		assert.pushResult({ result: false, message: er.message });
		done();
		throw er;
	});
});

QUnit.test('[ID7] Key navigation multi selection', function (assert) {
	assert.expect(78);

	var $input, $items, $hiddenInput, $listItemsDiv, isValueCorrect,
		done = assert.async(),
		$combo = $.ig.TestUtil.appendToFixture(this.divTag, { id: "combo-keynavmult" }),
		selectionChangingFires = 0, selectionChangedFires = 0,
		dropDownOpenedFires = 0, dropDownOpeningFires = 0,
		dropDownClosedFires = 0, dropDownClosingFires = 0,
		dataSource = [{ ID: 1, Name: "John Smith" },
		{ ID: 2, Name: "Mary Johnson" },
		{ ID: 3, Name: "Bob Ferguson" },
		{ ID: 4, Name: "Tom Tomov" },
		{ ID: 5, Name: "Stewerd Matewson" },
		{ ID: 6, Name: "David Bengalski" }];

	$combo.igCombo({
		dataSource: dataSource,
		textKey: 'Name',
		animationShowDuration: 0,
		animationHideDuration: 0,
		multiSelection: { enabled: true },
		selectionChanging: function (event, args) { selectionChangingFires++; },
		selectionChanged: function (event, args) { selectionChangedFires++; },
		dropDownOpening: function (event, args) { dropDownOpeningFires++; },
		dropDownOpened: function (event, args) { dropDownOpenedFires++; },
		dropDownClosing: function (event, args) { dropDownClosingFires++; },
		dropDownClosed: function (event, args) { dropDownClosedFires++; }
	});

	$hiddenInput = $combo.find('.ui-igcombo-hidden-field');
	$input = $combo.find('.ui-igcombo-field');
	$listItemsDiv = $combo.igCombo('dropDown');
	$items = $listItemsDiv.find('li');

	$.ig.TestUtil.keyInteraction(40, $input); // key down
	$.ig.TestUtil.wait(20).then(function () {
		assert.ok($listItemsDiv.height() > 0, 'List items list should  be visible');
		assert.strictEqual(1, dropDownOpeningFires, 'dropDownOpening event should fire');
		assert.strictEqual(1, dropDownOpenedFires, 'dropDownOpened event should fire');

		$.ig.TestUtil.keyInteraction(40, $input); // key down
		assert.strictEqual($input.val(), "", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');
		assert.ok($items.eq(0).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused by key down');
		assert.strictEqual(0, selectionChangingFires, 'selectionChanging event should not fire');
		assert.strictEqual(0, selectionChangedFires, 'selectionChanged event should not fire');

		$.ig.TestUtil.keyInteraction(38, $input); // key up
		assert.ok(!$items.eq(0).hasClass('ui-igcombo-item-in-focus'), 'Item should be unfocused by key up');
		assert.strictEqual($input.val(), "", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');
		assert.strictEqual(0, selectionChangingFires, 'selectionChanging event should not fire');
		assert.strictEqual(0, selectionChangedFires, 'selectionChanged event should not fire');
		assert.strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible');

		$.ig.TestUtil.keyInteraction(40, $input, "altKey"); // alt + key down
		assert.ok($listItemsDiv.height() > 0, 'List items list should  be visible after pressing Alt+key down');
		assert.ok(!$items.eq(0).hasClass('ui-igcombo-item-in-focus'), 'Item should not be focused');

		$.ig.TestUtil.keyInteraction(40, $input); // key down
		assert.ok($items.eq(0).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
		assert.strictEqual($input.val(), "", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');
		assert.strictEqual(2, dropDownOpeningFires, 'dropDownOpening event should fire');
		assert.strictEqual(2, dropDownOpenedFires, 'dropDownOpened event should fire');

		$.ig.TestUtil.keyInteraction(40, $input); // key down
		$.ig.TestUtil.keyInteraction(40, $input); // key down
		assert.strictEqual($input.val(), "", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');
		assert.strictEqual(2, $combo.igCombo('activeIndex'), 'activ index is not correct');
		assert.ok($items.eq(2).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused by key down');
		assert.ok(!$items.eq(2).hasClass('ui-state-active'), 'Item should not be selected');
		assert.strictEqual(0, selectionChangingFires, 'selectionChanging event should not fire');
		assert.strictEqual(0, selectionChangedFires, 'selectionChanged event should not fire');
		assert.ok($listItemsDiv.height() > 0, 'List items list should  be visible');

		$.ig.TestUtil.keyInteraction(38, $input); // key up
		assert.strictEqual($input.val(), "", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');
		assert.strictEqual(1, $combo.igCombo('activeIndex'), 'activ index is not correct');
		assert.ok($items.eq(1).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused by key up');
		assert.ok(!$items.eq(1).hasClass('ui-state-active'), 'Item should not be selected by key up');
		assert.strictEqual(0, selectionChangingFires, 'selectionChanging event should not fire');
		assert.strictEqual(0, selectionChangedFires, 'selectionChanged event should not fire');

		$.ig.TestUtil.keyInteraction(13, $input); // enter key
		// Workaround for issue where the input is not focused when running tests headless, thus 'Mary Jonhson' is without item separator
		isValueCorrect = $input.val() === 'Mary Johnson, ' || $input.val() === 'Mary Johnson';
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Mary Johnson", 'Hidden input value is incorrect');
		assert.ok($items.eq(1).hasClass('ui-state-active'), 'Item should be selected by press Enter');
		assert.strictEqual(1, selectionChangingFires, 'selectionChanging event should fire');

		$.ig.TestUtil.keyInteraction(40, $input); // key down
		$.ig.TestUtil.keyInteraction(40, $input); // key down
		// Workaround for issue where the input is not focused when running tests headless, thus 'Mary Jonhson' is without item separator
		isValueCorrect = $input.val() === 'Mary Johnson, ' || $input.val() === 'Mary Johnson';
		assert.ok(isValueCorrect, 'Input value is incorrect 2');
		assert.strictEqual($hiddenInput.val(), "Mary Johnson", 'Hidden input value is incorrect');
		assert.strictEqual(3, $combo.igCombo('activeIndex'), 'active index is not correct');
		assert.ok($items.eq(3).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused by key down');
		assert.notOk($items.eq(3).hasClass('ui-state-active'), 'Item should not be selected by key down');
		assert.strictEqual(1, selectionChangingFires, 'selectionChanging event should not fire');
		assert.strictEqual(1, selectionChangedFires, 'selectionChanged event should not fire');

		$.ig.TestUtil.keyInteraction(13, $input, "ctrlKey"); // ctrl + enter key
		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'Mary Johnson, Tom Tomov, ' || $input.val() === 'Mary Johnson, Tom Tomov';
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.ok($listItemsDiv.height() > 0, 'List items list should be visible after pressing Ctrl+enter');
		assert.strictEqual($hiddenInput.val(), "Mary Johnson, Tom Tomov", 'Hidden input value is incorrect');
		assert.ok($items.eq(1).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(3).hasClass('ui-state-active'), 'Item should be selected');
		assert.strictEqual(2, selectionChangingFires, 'selectionChanging event should fire');
		assert.strictEqual(2, selectionChangedFires, 'selectionChanged event should fire');

		$.ig.TestUtil.keyInteraction(38, $input); // key up
		$.ig.TestUtil.keyInteraction(38, $input); // key up
		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'Mary Johnson, Tom Tomov, ' || $input.val() === 'Mary Johnson, Tom Tomov';
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Mary Johnson, Tom Tomov", 'Hidden input value is incorrect');
		assert.strictEqual(1, $combo.igCombo('activeIndex'), 'activ index is not correct');
		assert.ok($items.eq(1).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused by key up');
		assert.ok($items.eq(1).hasClass('ui-state-active'), 'Item should be selected');

		$.ig.TestUtil.keyInteraction(13, $input, "ctrlKey"); // ctrl + enter key
		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'Tom Tomov, ' || $input.val() === 'Tom Tomov';
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.ok($listItemsDiv.height() > 0, 'List items list should be visible after pressing Ctrl+enter');
		assert.strictEqual($hiddenInput.val(), "Tom Tomov", 'Hidden input value is incorrect');
		assert.notOk($items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(3).hasClass('ui-state-active'), 'Item should be selected');
		assert.strictEqual(3, selectionChangingFires, 'selectionChanging event should fire');
		assert.strictEqual(3, selectionChangedFires, 'selectionChanged event should fire');

		$combo.igCombo('activeIndex', 0) // Set active index to be first item
		assert.strictEqual(0, $combo.igCombo('activeIndex'), 'activ index is not correct');
		assert.ok($items.eq(0).hasClass('ui-igcombo-item-in-focus'), 'Item should be active');

		$.ig.TestUtil.keyInteraction(13, $input, "ctrlKey"); // ctrl + enter key
		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'Tom Tomov, John Smith, ' || $input.val() === 'Tom Tomov, John Smith';
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.ok($listItemsDiv.height() > 0, 'List items list should be visible after pressing Ctrl+enter');
		assert.strictEqual($hiddenInput.val(), "Tom Tomov, John Smith", 'Hidden input value is incorrect');
		assert.ok($items.eq(0).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(3).hasClass('ui-state-active'), 'Item should be selected');
		assert.strictEqual(4, selectionChangingFires, 'selectionChanging event should fire');
		assert.strictEqual(4, selectionChangedFires, 'selectionChanged event should fire');

		$.ig.TestUtil.keyInteraction(38, $input, "altKey"); // ctrl + enter key
		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'Tom Tomov, John Smith, ' || $input.val() === 'Tom Tomov, John Smith';
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible after pressing alt+ key up');
		assert.strictEqual($hiddenInput.val(), "Tom Tomov, John Smith", 'Hidden input value is incorrect');
		done();
	}).catch(function (er) {
		assert.pushResult({ result: false, message: er.message });
		done();
		throw er;
	});
});

QUnit.test('[ID8] Keyboard navigation multi selection shift key', function (assert) {
	assert.expect(70);

	var $input, $items, $hiddenInput, $listItemsDiv, isValueCorrect,
		done = assert.async(),
		$combo = $.ig.TestUtil.appendToFixture(this.divTag, { id: "combo-keynavmultishift" }),
		keyDown = $.Event('keydown'),
		keyUp = $.Event('keyup'),
		dataSource = [{ ID: 1, Name: "John Smith" },
		{ ID: 2, Name: "Mary Johnson" },
		{ ID: 3, Name: "Bob Ferguson" },
		{ ID: 4, Name: "Tom Tomov" },
		{ ID: 5, Name: "Stewerd Matewson" },
		{ ID: 6, Name: "David Bengalski" }];

	$combo.igCombo({
		dataSource: dataSource,
		textKey: 'Name',
		animationShowDuration: 0,
		animationHideDuration: 0,
		multiSelection: { enabled: true }
	});

	keyUp.keyCode = keyDown.keyCode = 16; // shift

	$hiddenInput = $combo.find('.ui-igcombo-hidden-field');
	$input = $combo.find('.ui-igcombo-field');

	$.ig.TestUtil.keyInteraction(40, $input, "altKey"); // alt + key down
	$.ig.TestUtil.wait(20).then(function () {
		$listItemsDiv = $combo.igCombo('dropDown');
		$items = $listItemsDiv.find('li');
		assert.ok($listItemsDiv.height() > 0, 'List items list should  be visible after pressing Alt+key down');

		$input.trigger(keyDown); // Press and hold shift key
		$.ig.TestUtil.keyInteraction(40, $input, "shiftKey"); // shift + key down
		$.ig.TestUtil.keyInteraction(40, $input, "shiftKey"); // shift + key down
		$.ig.TestUtil.keyInteraction(40, $input, "shiftKey"); // shift + key down

		assert.ok($items.eq(0).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused by key down');
		assert.ok($items.eq(1).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused by key down');
		assert.ok($items.eq(2).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused by key down');
		assert.notOk($items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(2).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(0).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
		assert.ok($items.eq(1).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
		assert.ok($items.eq(2).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
		assert.strictEqual($input.val(), "", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');

		$input.trigger(keyUp); // release shift key
		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'John Smith, Mary Johnson, Bob Ferguson, ' || $input.val() === 'John Smith, Mary Johnson, Bob Ferguson';

		assert.ok($items.eq(0).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(1).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(2).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "John Smith, Mary Johnson, Bob Ferguson", 'Hidden input value is incorrect');

		$combo.igCombo('deselectAll') // Deselect all
		assert.notOk($items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(2).hasClass('ui-state-active'), 'Item should not be selected');
		assert.strictEqual($input.val(), "", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect 1');

		// Go to last position, because deselect all cleared the navigation item
		$.ig.TestUtil.keyInteraction(40, $input); // key down
		$.ig.TestUtil.keyInteraction(40, $input); // key down
		$.ig.TestUtil.keyInteraction(40, $input); // key down
		$input.trigger(keyDown); // Press and hold shift key	
		$.ig.TestUtil.keyInteraction(38, $input, "shiftKey"); // shift + key up
		assert.notOk($items.eq(0).hasClass('ui-igcombo-item-in-focus'), 'Item should not be in focused');
		assert.ok($items.eq(1).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
		assert.ok($items.eq(2).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');

		$input.trigger(keyUp); // release shift key
		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'Mary Johnson, Bob Ferguson, ' || $input.val() === 'Mary Johnson, Bob Ferguson';

		assert.notOk($items.eq(0).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(1).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(2).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Mary Johnson, Bob Ferguson", 'Hidden input value is incorrect');

		$input.trigger(keyDown); // Press and hold shift key
		$.ig.TestUtil.keyInteraction(40, $input, "shiftKey"); // shift + key down
		$.ig.TestUtil.keyInteraction(40, $input, "shiftKey"); // shift + key down
		$.ig.TestUtil.keyInteraction(40, $input, "shiftKey"); // shift + key down

		assert.ok($items.eq(1).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
		assert.ok($items.eq(2).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
		assert.ok($items.eq(3).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
		assert.ok($items.eq(4).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused ');

		$.ig.TestUtil.keyInteraction(38, $input, "shiftKey"); // shift + key up
		assert.ok($items.eq(1).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused ');
		assert.ok($items.eq(2).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
		assert.ok($items.eq(3).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused ');
		assert.notOk($items.eq(4).hasClass('ui-igcombo-item-in-focus'), 'Item should not be in focused by key up');

		$input.trigger(keyUp); // release shift key

		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'Mary Johnson, Bob Ferguson, Tom Tomov, ' || $input.val() === 'Mary Johnson, Bob Ferguson, Tom Tomov';

		assert.ok(!$items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(1).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(2).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(3).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok(!$items.eq(4).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Mary Johnson, Bob Ferguson, Tom Tomov", 'Hidden input value is incorrect');

		$item = $items.eq(5);
		$.ig.TestUtil.click($item, { "shiftKey": true }); // Click item holding shift key

		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'Mary Johnson, Bob Ferguson, Tom Tomov, Stewerd Matewson, David Bengalski, ' ||
			$input.val() === 'Mary Johnson, Bob Ferguson, Tom Tomov, Stewerd Matewson, David Bengalski';

		assert.ok(!$items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(2).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(3).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(4).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(5).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Mary Johnson, Bob Ferguson, Tom Tomov, Stewerd Matewson, David Bengalski", 'Hidden input value is incorrect');

		$item = $items.eq(4);
		$.ig.TestUtil.click($item, { "ctrlKey": true }); // Click item holding control key

		// Workaround for issue where the input is not focused when running tests headless and item separator is not added and item separator is not added
		isValueCorrect = $input.val() === 'Mary Johnson, Bob Ferguson, Tom Tomov, David Bengalski, ' || $input.val() === 'Mary Johnson, Bob Ferguson, Tom Tomov, David Bengalski';

		assert.ok(!$items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(2).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(3).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok(!$items.eq(4).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(5).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Mary Johnson, Bob Ferguson, Tom Tomov, David Bengalski", 'Hidden input value is incorrect');

		$combo.igCombo('clearInput') // Clear input
		assert.notOk($items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(2).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(4).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(5).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(6).hasClass('ui-state-active'), 'Item should not be selected');
		assert.strictEqual($input.val(), "", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect 1');

		$.ig.TestUtil.keyInteraction(38, $input, "altKey"); // alt + key up
		return $.ig.TestUtil.wait(20);
	}).then(function () {
		assert.strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible after pressing alt+ key up');
		done();
	}).catch(function (er) {
		assert.pushResult({ result: false, message: er.message });
		done();
		throw er;
	});
});

QUnit.test('[ID9] Single selection typing in input', function (assert) {
	assert.expect(29);

	var $input, $items, $hiddenInput, $listItemsDiv, $button,
		done = assert.async(),
		$combo = $.ig.TestUtil.appendToFixture(this.divTag, { id: "combo-singleseltype" }),
		selectionChangingFires = 0, selectionChangedFires = 0,
		click = $.Event('click'),
		dataSource = [{ ID: 1, Name: "John" },
		{ ID: 2, Name: "Mary" },
		{ ID: 3, Name: "Bob" },
		{ ID: 4, Name: "Tom" },
		{ ID: 5, Name: "Stewerd" },
		{ ID: 6, Name: "David" },
		{ ID: 7, Name: "Anna" },
		{ ID: 7, Name: "Hana" },
		{ ID: 8, Name: "Betty" }];

	$combo.igCombo({
		dataSource: dataSource,
		textKey: 'Name',
		animationShowDuration: 0,
		animationHideDuration: 0,
		delayInputChangeProcessing: 0,
		selectionChanging: function (event, args) { selectionChangingFires++; },
		selectionChanged: function (event, args) { selectionChangedFires++; }
	});

	$hiddenInput = $combo.find('.ui-igcombo-hidden-field');
	$input = $combo.find('.ui-igcombo-field');
	$button = $combo.find('.ui-igcombo-button');

	// 1. Type 'h'
	$.ig.TestUtil.keyDownChar('h', $input);
	$input.val('h');
	$.ig.TestUtil.keyUpChar('h', $input);
	//typeInInput("h", $input);
	$.ig.TestUtil.wait(100).then(function () {
		// Test 'h'
		$listItemsDiv = $combo.igCombo('dropDown');
		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
		assert.ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');
		assert.notOk($items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(1).hasClass('ui-state-active'), 'Item should be selected');
		assert.strictEqual($input.val(), "h", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Hana", 'Hidden input value is incorrect');

		$.ig.TestUtil.keyInteraction(38, $input, "altKey"); // alt + key up
		$listItemsDiv = $combo.igCombo('dropDown');
		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
		assert.strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible after pressing alt+ key up');
		assert.notOk($items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(7).hasClass('ui-state-active'), 'Item should be selected');
		assert.strictEqual($input.val(), "Hana", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Hana", 'Hidden input value is incorrect');

		// 2. Type 'hn'
		$.ig.TestUtil.keyDownChar('hn', $input);
		$input.val('hn');
		$.ig.TestUtil.keyUpChar('hn', $input);
		return $.ig.TestUtil.wait(100);
	}).then(function () {
		// Test 'hn'
		$listItemsDiv = $combo.igCombo('dropDown');
		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
		assert.ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');
		assert.strictEqual($input.val(), "hn", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');
		assert.notOk($items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');

		$button.trigger(click); // Close drop down

		$listItemsDiv = $combo.igCombo('dropDown');
		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
		assert.strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible after pressing alt+ key up');
		assert.notOk($items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(7).hasClass('ui-state-active'), 'Item should not be selected');
		assert.strictEqual($input.val(), "", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');

		// 3. Type 'm'
		//typeInInput("m", $input);
		$.ig.TestUtil.keyDownChar('m', $input);
		$input.val('m');
		$.ig.TestUtil.keyUpChar('m', $input);
		return $.ig.TestUtil.wait(100);
	}).then(function () {
		// Test 'm'
		$listItemsDiv = $combo.igCombo('dropDown');
		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
		assert.ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');
		assert.notOk($items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(0).hasClass('ui-state-active'), 'Item should be selected');
		assert.strictEqual($input.val(), "m", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Mary", 'Hidden input value is incorrect');

		$item = $items.eq(0);
		$.ig.TestUtil.click($item); // Click on selected item
		$listItemsDiv = $combo.igCombo('dropDown');
		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
		assert.strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible after selecting item');
		assert.ok($items.eq(1).hasClass('ui-state-active'), 'Item should be selected');
		assert.notOk($items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
		assert.strictEqual($input.val(), "Mary", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Mary", 'Hidden input value is incorrect');
		done();
	}).catch(function (er) {
		assert.pushResult({ result: false, message: er.message });
		done();
		throw er;
	});
});

QUnit.test('[ID9] Multi selection typing in input', function (assert) {
	assert.expect(28);

	var $input, $items, $hiddenInput, $listItemsDiv, isValueCorrect,
		done = assert.async(),
		$combo = $.ig.TestUtil.appendToFixture(this.divTag, { id: "combo-multiseltype" }),
		selectionChangingFires = 0, selectionChangedFires = 0,
		dataSource = [{ ID: 1, Name: "John" },
		{ ID: 2, Name: "Mary" },
		{ ID: 3, Name: "Bob" },
		{ ID: 4, Name: "Tom" },
		{ ID: 5, Name: "Stewerd" },
		{ ID: 6, Name: "David" },
		{ ID: 7, Name: "Anna" },
		{ ID: 7, Name: "Hana" },
		{ ID: 8, Name: "Betty" }];

	$combo.igCombo({
		dataSource: dataSource,
		textKey: 'Name',
		animationShowDuration: 0,
		animationHideDuration: 0,
		delayInputChangeProcessing: 0,
		selectionChanging: function (event, args) { selectionChangingFires++; },
		selectionChanged: function (event, args) { selectionChangedFires++; },
		multiSelection: { enabled: true }
	});

	$hiddenInput = $combo.find('.ui-igcombo-hidden-field');
	$input = $combo.find('.ui-igcombo-field');

	// 1. Type 'a'
	//typeInInput("a", $input);
	$.ig.TestUtil.keyDownChar("a", $input);
	$input.val("a");
	$.ig.TestUtil.keyUpChar("a", $input);
	$.ig.TestUtil.wait(100).then(function () {
		// Test 'a'
		$listItemsDiv = $combo.igCombo('dropDown');
		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
		assert.ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');
		assert.ok(!$items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok(!$items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok(!$items.eq(2).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok(!$items.eq(0).hasClass('ui-igcombo-item-in-focus'), 'Item should not be focused');
		assert.ok(!$items.eq(1).hasClass('ui-igcombo-item-in-focus'), 'Item should not be focused');
		assert.ok($items.eq(2).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
		assert.strictEqual($input.val(), "a", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');

		// 2. Type 'a, '
		//typeInInput("a, ", $input);
		$.ig.TestUtil.keyDownChar("a, ", $input);
		$input.val("a, ");
		$.ig.TestUtil.keyUpChar("a, ", $input);
		return $.ig.TestUtil.wait(100);
	}).then(function () {
		// Test 'a, '
		$listItemsDiv = $combo.igCombo('dropDown');
		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');

		assert.ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');

		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'Anna, ' || $input.val() === 'Anna';
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Anna", 'Hidden input value is incorrect');
		assert.notOk($items.eq(2).hasClass('ui-state-active'), 'Item should not be selected');
		assert.ok($items.eq(6).hasClass('ui-state-active'), 'Item should be selected');

		// 3. Type 'Anna, h'
		//typeInInput("Anna, h", $input);
		$.ig.TestUtil.keyDownChar("Anna, h", $input);
		$input.val("Anna, h");
		$.ig.TestUtil.keyUpChar("Anna, h", $input);
		return $.ig.TestUtil.wait(100);
	}).then(function () {
		// Test 'Anna, h'
		$listItemsDiv = $combo.igCombo('dropDown');
		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
		assert.ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');
		assert.notOk($items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
		assert.notOk($items.eq(0).hasClass('ui-igcombo-item-in-focus'), 'Item should not be focused');
		assert.ok($items.eq(1).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
		assert.strictEqual($input.val(), "Anna, h", 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Anna", 'Hidden input value is incorrect');

		//emulateKeyBoard(13, false, false, false, $input); // press enter key
		$.ig.TestUtil.keyInteraction(13, $input); // press enter key
		$listItemsDiv = $combo.igCombo('dropDown');
		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');

		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'Anna, Hana, ' || $input.val() === 'Anna, Hana';
		assert.ok($listItemsDiv.height() > 0, 'List items list should be visible after press enter key');
		assert.ok($items.eq(6).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok($items.eq(7).hasClass('ui-state-active'), 'Item should be selected');
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Anna, Hana", 'Hidden input value is incorrect');

		//emulateKeyBoard("up", false, false, true, $input); // alt + key up
		$.ig.TestUtil.keyInteraction(38, $input, "altKey"); // alt + key up
		// Workaround for issue where the input is not focused when running tests headless and item separator is not added
		isValueCorrect = $input.val() === 'Anna, Hana, ' || $input.val() === 'Anna, Hana';
		assert.ok(isValueCorrect, 'Input value is incorrect');
		assert.strictEqual($hiddenInput.val(), "Anna, Hana", 'Hidden input value is incorrect');
		done();
	}).catch(function (er) {
		assert.pushResult({ result: false, message: er.message });
		done();
		throw er;
	});
});

// // Single selection typing in input autoSelectFirstMatch false
// asyncTest(testId_11, 28, function () {
// 	var $input, $items, $hiddenInput, $listItemsDiv,
// 		$combo = $('#combo-singleseltypeasfmfalse'),
// 		selectionChangingFires = 0, selectionChangedFires = 0,
// 		click = $.Event('click'),
// 		dataSource = [{ ID: 1, Name: "John" },
// 			{ ID: 2, Name: "Mary" },
// 			{ ID: 3, Name: "Bob" },
// 			{ ID: 4, Name: "Tom" },
// 			{ ID: 5, Name: "Stewerd" },
// 			{ ID: 6, Name: "David" },
// 			{ ID: 7, Name: "Anna" },
// 			{ ID: 7, Name: "Hana" },
// 			{ ID: 8, Name: "Betty" }];

// 	$combo.igCombo({
// 		dataSource: dataSource,
// 		textKey: 'Name',
// 		animationShowDuration: 0,
// 		animationHideDuration: 0,
// 		delayInputChangeProcessing: 0,
// 		autoSelectFirstMatch: false,
// 		selectionChanging: function (event, args) { selectionChangingFires++; },
// 		selectionChanged: function (event, args) { selectionChangedFires++; }
// 	});

// 	$hiddenInput = $combo.find('.ui-igcombo-hidden-field');
// 	$input = $combo.find('.ui-igcombo-field');
// 	$listItemsDiv = $combo.igCombo('dropDown');
// 	$button = $combo.find('.ui-igcombo-button');

// 	// 1. Type 'h'
// 	typeInInput("h", $input);
// 	setTimeout(function () {
// 		start();

// 		// Test 'h'
// 		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
// 		ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');
// 		ok(!$items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
// 		ok(!$items.eq(1).hasClass('ui-state-active'), 'Item should be selected');
// 		strictEqual($input.val(), "h", 'Input value is incorrect');
// 		strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');

// 		emulateKeyBoard("up", false, false, true, $input); // alt + key up
// 		$listItemsDiv = $combo.igCombo('dropDown');
// 		$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
// 		strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible after pressing alt+ key up');
// 		ok(!$items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
// 		ok(!$items.eq(7).hasClass('ui-state-active'), 'Item should not be selected');
// 		strictEqual($input.val(), "", 'Input value is incorrect');
// 		strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');

// 		// 2. Type 'hana'
// 		typeInInput("hana", $input);
// 		setTimeout(function () {
// 			start();

// 			// Test 'hana'
// 			$listItemsDiv = $combo.igCombo('dropDown');
// 			$items = $listItemsDiv.find('li').not('.ui-helper-hidden');

// 			ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');
// 			strictEqual($input.val(), "hana", 'Input value is incorrect');
// 			strictEqual($hiddenInput.val(), "Hana", 'Hidden input value is incorrect');
// 			ok($items.eq(0).hasClass('ui-state-active'), 'Item should be selected');

// 			$button.trigger(click); // Close drop down

// 			$listItemsDiv = $combo.igCombo('dropDown');
// 			$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
// 			strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible');
// 			ok(!$items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
// 			ok($items.eq(7).hasClass('ui-state-active'), 'Item should be selected');
// 			strictEqual($input.val(), "Hana", 'Input value is incorrect');
// 			strictEqual($hiddenInput.val(), "Hana", 'Hidden input value is incorrect');

// 			// 3. Type 'm'
// 			typeInInput("m", $input);
// 			setTimeout(function () {
// 				start();

// 				// Test 'm'
// 				$listItemsDiv = $combo.igCombo('dropDown');
// 				$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
// 				ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');
// 				ok(!$items.eq(0).hasClass('ui-state-active'), 'Item should be selected');
// 				strictEqual($input.val(), "m", 'Input value is incorrect');
// 				strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');

// 				$item = $items.eq(0);
// 				clickElement($item, false, false); // Click on selected item

// 				$listItemsDiv = $combo.igCombo('dropDown');
// 				$items = $listItemsDiv.find('li').not('.ui-helper-hidden');
// 				strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible after selecting item');
// 				ok($items.eq(1).hasClass('ui-state-active'), 'Item should be selected');
// 				ok(!$items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
// 				strictEqual($input.val(), "Mary", 'Input value is incorrect');
// 				strictEqual($hiddenInput.val(), "Mary", 'Hidden input value is incorrect');
// 			}, 100);

// 			stop();
// 		}, 100);

// 		stop();
// 	}, 100);
// });

// // Multi selection typing in input autoSelectFirstMatch false
// asyncTest(testId_12, 24, function () {
// 	var $input, $items, $hiddenInput, $listItemsDiv, isValueCorrect,
// 		$combo = $('#combo-multiseltypeasfmfalse'),
// 		selectionChangingFires = 0, selectionChangedFires = 0,
// 		dataSource = [{ ID: 1, Name: "John" },
// 			{ ID: 2, Name: "Mary" },
// 			{ ID: 3, Name: "Bob" },
// 			{ ID: 4, Name: "Tom" },
// 			{ ID: 5, Name: "Stewerd" },
// 			{ ID: 6, Name: "David" },
// 			{ ID: 7, Name: "Anna" },
// 			{ ID: 7, Name: "Hana" },
// 			{ ID: 8, Name: "Betty" }];

// 	$combo.igCombo({
// 		dataSource: dataSource,
// 		textKey: 'Name',
// 		animationShowDuration: 0,
// 		animationHideDuration: 0,
// 		delayInputChangeProcessing: 0,
// 		selectionChanging: function (event, args) { selectionChangingFires++; },
// 		selectionChanged: function (event, args) { selectionChangedFires++; },
// 		multiSelection: { enabled: true },
// 		autoSelectFirstMatch: false
// 	});

// 	$hiddenInput = $combo.find('.ui-igcombo-hidden-field');
// 	$input = $combo.find('.ui-igcombo-field');
// 	$listItemsDiv = $combo.igCombo('dropDown');

// 	typeInInput("a", $input);
// 	setTimeout(function () {
// 		start();

// 		$items = $combo.igCombo('dropDown').find('li').not('.ui-helper-hidden');
// 		ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');
// 		ok(!$items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
// 		ok(!$items.eq(1).hasClass('ui-state-active'), 'Item should not be selected');
// 		ok(!$items.eq(2).hasClass('ui-state-active'), 'Item should be selected');
// 		strictEqual($input.val(), "a", 'Input value is incorrect');
// 		strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');

// 		typeInInput("anna", $input);
// 		setTimeout(function () {
// 			start();

// 			$items = $combo.igCombo('dropDown').find('li').not('.ui-helper-hidden');
// 			ok($items.eq(0).hasClass('ui-igcombo-item-in-focus'), 'Item should be focused');
// 			strictEqual($input.val(), "anna", 'Input value is incorrect');
// 			strictEqual($hiddenInput.val(), "", 'Hidden input value is incorrect');

// 			typeInInput("anna, ", $input);
// 			setTimeout(function () {
// 				start();

// 				$items = $combo.igCombo('dropDown').find('li').not('.ui-helper-hidden');

// 				// Workaround for issue where the input is not focused when running tests headless and item separator is not added
// 				isValueCorrect = $input.val() === 'Anna, ' || $input.val() === 'Anna';

// 				ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');
// 				ok(isValueCorrect, 'Input value is incorrect');
// 				strictEqual($hiddenInput.val(), "Anna", 'Hidden input value is incorrect');
// 				ok(!$items.eq(2).hasClass('ui-state-active'), 'Item should not be selected');
// 				ok($items.eq(6).hasClass('ui-state-active'), 'Item should be selected');

// 				typeInInput("Anna, h", $input);
// 				setTimeout(function () {
// 					start();

// 					$items = $combo.igCombo('dropDown').find('li').not('.ui-helper-hidden');
// 					ok($listItemsDiv.height() > 0, 'List items list should be visible after typing in input');
// 					ok(!$items.eq(0).hasClass('ui-state-active'), 'Item should not be selected');
// 					ok(!$items.eq(1).hasClass('ui-state-active'), 'Item should be selected');
// 					strictEqual($input.val(), "Anna, h", 'Input value is incorrect');
// 					strictEqual($hiddenInput.val(), "Anna", 'Hidden input value is incorrect');

// 					emulateKeyBoard("up", false, false, true, $input); // alt + key up
// 					strictEqual(0, $listItemsDiv.height(), 'List items list should not be visible after pressing alt+ key up');
// 					$items = $combo.igCombo('dropDown').find('li').not('.ui-helper-hidden');

// 					// Workaround for issue where the input is not focused when running tests headless and item separator is not added
// 					isValueCorrect = $input.val() === 'Anna, ' || $input.val() === 'Anna';

// 					ok($items.eq(6).hasClass('ui-state-active'), 'Item should be selected');
// 					ok(!$items.eq(7).hasClass('ui-state-active'), 'Item should be selected');
// 					ok(isValueCorrect, 'Input value is incorrect');
// 					strictEqual($hiddenInput.val(), "Anna", 'Hidden input value is incorrect');
// 				}, 100);

// 				stop();
// 			}, 100);

// 			stop();
// 		}, 100);

// 		stop();
// 	}, 100);
// });

// // Multiple selection should be enabled when a select element is decorated with the multiple attribute
// test(testId_15, function () {
// 	var multiSelection,
// 		$comboWrapper = $('#combo-multiple-attribute'),
// 		dataSource = [
// 			{ ID: 1, Name: "John" },
// 			{ ID: 2, Name: "Mary" },
// 			{ ID: 3, Name: "Bob" }
// 		],
// 		multiSelectionEnabledValue = false;

// 	$comboWrapper.igCombo({
// 		dataSource: dataSource,
// 		textKey: 'Name',
// 		valueKey: 'ID'
// 	});

// 	multiSelection = $comboWrapper.igCombo('option', 'multiSelection');
// 	multiSelectionEnabledValue = multiSelection.enabled;
// 	ok(multiSelectionEnabledValue, 'Multiple selection was not enabled.');
// });

// // If the settings for multiple selection are present they should override the attribute on the element
// test(testId_16, function () {
// 	var multiSelection,
// 		$comboWrapper = $('#combo-multiple-single-selection'),
// 		dataSource = [
// 			{ ID: 1, Name: "John" },
// 			{ ID: 2, Name: "Mary" },
// 			{ ID: 3, Name: "Bob" }
// 		],
// 		multiSelectionEnabledValue = false;

// 	$comboWrapper.igCombo({
// 		dataSource: dataSource,
// 		textKey: 'Name',
// 		valueKey: 'ID',
// 		multiSelection: {
// 			enabled: false
// 		}
// 	});

// 	multiSelection = $comboWrapper.igCombo('option', 'multiSelection');
// 	multiSelectionEnabledValue = multiSelection.enabled;
// 	ok(!multiSelectionEnabledValue, 'Multiple selection was not disabled.');
// });

// // If the settings for multiple selection are present they should override the attribute on the element
// test(testId_17, function () {
// 	var multiSelection,
// 		$comboWrapper = $('#combo-multiple-multi-selection'),
// 		dataSource = [
// 			{ ID: 1, Name: "John" },
// 			{ ID: 2, Name: "Mary" },
// 			{ ID: 3, Name: "Bob" }
// 		],
// 		multiSelectionEnabledValue = false;

// 	$comboWrapper.igCombo({
// 		dataSource: dataSource,
// 		textKey: 'Name',
// 		valueKey: 'ID',
// 		multiSelection: {
// 			enabled: true
// 		}
// 	});

// 	multiSelection = $comboWrapper.igCombo('option', 'multiSelection');
// 	multiSelectionEnabledValue = multiSelection.enabled;
// 	ok(multiSelectionEnabledValue, 'Multiple selection was not enabled.');
// });

// // Keyboard interacting
// test(testId_18, function () {
// 	var data, selectedItem, $input,
// 	$combo = $("#keyboard-interactions");

// 	data = [{ "ID": 1, "ProductName": "Chai", "SupplierName": "Exotic Liquids" },
// 		   { "ID": 2, "ProductName": "Chang", "SupplierName": "Exotic Liquids" },
// 		   { "ID": 3, "ProductName": "Aniseed Syrup", "SupplierName": "Exotic Liquids" },
// 		   { "ID": 4, "ProductName": "Chef Anton's Cajun Seasoning", "SupplierName": "New Orleans Cajun Delights" },
// 		   { "ID": 5, "ProductName": "Chef Anton's Gumbo Mix", "SupplierName": "New Orleans Cajun Delights", },
// 		   { "ID": 6, "ProductName": "Grandma's Boysenberry Spread", "SupplierName": "Grandma Kelly Homestead", },
// 		  { "ID": 7, "ProductName": "Uncle Bob's Organic Dried Pears", "SupplierName": "Grandma Kelly Homestead", },
// 		  { "ID": 8, "ProductName": "Northwoods Cranberry Sauce", "SupplierName": "Grandma Kelly Homestead", },
// 		  { "ID": 9, "ProductName": "Mishi Kobe Niku", "SupplierName": "Tokyo Traders", },
// 		  { "ID": 10, "ProductName": "Ikura", "SupplierName": "Tokyo Traders", },
// 		  { "ID": 11, "ProductName": "Queso Cabrales", "SupplierName": "Cooperativa de Quesos Las Cabras", }]

// 	$combo.igCombo({
// 		dataSource: data,
// 		valueKey: "ID",
// 		textKey: 'ProductName',
// 		mode: "dropdown",
// 		width: 200,
// 		height: 30,
// 		allowCustomValues: true,
// 		autoSelectFirstMatch: true,
// 		multiSelection: {
// 			enabled: false,
// 		},
// 	});

// 	$input = $combo.igCombo("textInput");
// 	emulateNonSpecialKeyPress(77, $input);
// 	selectedItem = $combo.igCombo("selectedItems")[0];
// 	equal(selectedItem.data[$combo.igCombo("option", "textKey")], "Mishi Kobe Niku", "Correct item is selected");

// 	$combo.igCombo("option", "multiSelection", { enabled: true });

// 	setTimeout(function () {
// 		start();
// 		emulateNonSpecialKeyPress(67, $input);
// 		equal($($combo.igCombo('dropDown').find("li")[0]).hasClass("ui-igcombo-item-in-focus"), true, "The auto completed item is highlighted with css class 'ui-igcombo-item-in-focus'");
// 	}, 1100);
// 	stop();

// });

// test(testId_19, function () {

// 	var $combo = $("#suppressKeyboard"),
// 		$input, $dropDownButton;

// 	// Emulate touch environment
// 	var _oldIsTouch = $.ig.util.isTouchDevice;
// 	$.ig.util.isTouchDevice = function () { return true; };

// 	$combo.igCombo({
// 		animationShowDuration: 0,
// 		animationHideDuration: 0,
// 		width: "270px",
// 		dataSource: [
// 			{ 'ID': 1 },
// 			{ 'ID': 2 },
// 			{ 'ID': 3 }
// 		],
// 		suppressKeyboard: true,
// 		virtualization: true
// 	});

// 	$input = $combo.data().igCombo._options.$input;
// 	$dropDownButton = $combo.data().igCombo._options.$dropDownBtnCont;

// 	$dropDownButton.click();
// 	equal($combo.igCombo("dropDownOpened"), true, "Combo drop down should be rendered");
// 	notEqual(document.activeElement, $input[0], "Combo input should not be focused [suppressKeyboard = false]");

// 	$dropDownButton.click();
// 	equal($combo.igCombo("dropDownOpened"), false, "Combo drop down should be hidden");
// 	notEqual(document.activeElement, $input[0], "Combo input still should not be focused [suppressKeyboard = false]");

// 	$combo.igCombo("option", "suppressKeyboard", false);
// 	equal($combo.igCombo("option", "suppressKeyboard"), false, "suppressKeyboard successfully changed");

// 	$dropDownButton.click();
// 	equal($combo.igCombo("dropDownOpened"), true, "Combo drop down should be rendered");
// 	equal(document.activeElement, $input[0], "Combo input should be focused [suppressKeyboard = true]");

// 	$dropDownButton.click();
// 	equal($combo.igCombo("dropDownOpened"), false, "Combo drop down should be hidden");
// 	equal(document.activeElement, $input[0], "Combo input still should be focused [suppressKeyboard = true]");


// 	$.ig.util.isTouchDevice = _oldIsTouch;
// });

// test(testId_20, function () {

// 	var $combo = $("#suppressKeyboardMultiSelect"),
// 		$input, $dropDownButton, listItems;

// 	// Emulate touch environment
// 	var _oldIsTouch = $.ig.util.isTouchDevice;
// 	$.ig.util.isTouchDevice = function () { return true; };

// 	$combo.igCombo({
// 		animationShowDuration: 0,
// 		animationHideDuration: 0,
// 		width: "270px",
// 		dataSource: [
// 			{ "ID":1, "Name": "Captain America", "Age": 45 },
// 			{ "ID":2, "Name": "Hawkeye", "Age": 32 },
// 			{ "ID":3, "Name": "Quicksilver", "Age": 27 },
// 		],
// 		valueKey: "ID",
// 		textKey: "Name",
// 		multiSelection: {
// 			enabled: true
// 		},
// 		suppressKeyboard: true,
// 		virtualization: true
// 	});

// 	$input = $combo.data().igCombo._options.$input;
// 	$dropDownButton = $combo.data().igCombo._options.$dropDownBtnCont;

// 	var items = $combo.igCombo('items');

// 	$dropDownButton.click();
// 	equal($combo.igCombo("dropDownOpened"), true, "Combo drop down should be rendered");
// 	notEqual(document.activeElement, $input[0], "Combo input should not be focused [suppressKeyboard = true]");
// 	clickElement(items[0].element);

// 	equal($combo.igCombo('activeIndex'), 0, 'Selected item matches');
// 	notEqual(document.activeElement, $input[0], 'Combo input is not focused');

// 	clickElement(items[1].element);

// 	equal($combo.igCombo('activeIndex'), 1, 'Selected item matches');
// 	notEqual(document.activeElement, $input[0], 'Combo input is still not focused');

// 	clickElement(items[0].element);
// 	clickElement(items[1].element);
// 	equal($combo.igCombo('activeIndex'), -1);
// 	notEqual(document.activeElement, $input[0], 'Combo input is still not focused');

// 	clickElement($input);
// 	equal(document.activeElement, $input[0], 'Combo input is focused');

// 	$dropDownButton.click();

// 	$combo.igCombo('option', 'suppressKeyboard', false);
// 	$combo.igCombo('clearInput');

// 	$dropDownButton.click();
// 	equal(document.activeElement, $input[0], "Combo input should be focused [suppressKeyboard = false]");

// 	clickElement(items[0].element);

// 	equal($combo.igCombo('activeIndex'), 0, 'Selected item matches');
// 	equal(document.activeElement, $input[0], 'Combo input is focused');

// 	$.ig.util.isTouchDevice = _oldIsTouch;
// });

// test(testId_21, function() {
// 	var $combo = $("#dropdowninputpress"),
// 		$input;

// 	$combo.igCombo({
// 		animationShowDuration: 0,
// 		animationHideDuration: 0,
// 		delayInputChangeProcessing: 0,
// 		dataSource: [
// 			{ "ID":1, "Name": "John Smith", "Age": 45 },
// 			{ "ID":6, "Name": "John Ricks", "Age": 45 },
// 			{ "ID":2, "Name": "Mary Johnson", "Age": 32 },
// 			{ "ID":3, "Name": "Bob Ferguson", "Age": 27 },
// 			{ "ID": 4, Name: "Jane Smith", "Age": 22},
// 			{ "ID": 5, "Name": "Johnatan Doe", "Age": 45 },
// 		],
// 		valueKey: "ID",
// 		textKey: "Name",
// 		mode: "dropdown",
// 		itemsRendered: function(evt, ui) {
// 			ui.owner.deselectByIndex(0);
// 		}
// 	});

// 	$input = $combo.data().igCombo._options.$input;

// 	$input.focus();
// 	emulateNonSpecialKeyPress(106, $input);
// 	equal($combo.igCombo('selectedItems')[0].data.Name, 'John Smith', 'Selected item matches');
// 	emulateNonSpecialKeyPress(106, $input);
// 	equal($combo.igCombo('selectedItems')[0].data.Name, 'John Ricks', 'Selected item matches');
// 	emulateNonSpecialKeyPress(106, $input);
// 	equal($combo.igCombo('selectedItems')[0].data.Name, 'Jane Smith', 'Selected item matches');
// 	emulateNonSpecialKeyPress(106, $input);
// 	equal($combo.igCombo('selectedItems')[0].data.Name, 'Johnatan Doe', 'Selected item matches');
// });

// // Bug #190262
// test(testId_22, function () {
// 	var data, $input, $listItems,
// 		$combo = $("#combo-bug-190262");

// 	data = [{ ID: 0, Name: "John", Age: 45, ModifiedDate: "1/1/2000" },
// 		{ ID: 1, Name: "Chai", Age: 32, ModifiedDate: new Date(1309467600000) },
// 		{ ID: 2, Name: "Chang", Age: 32, ModifiedDate: "/Date(1078992096827)/" },
// 		{ ID: 5, Name: "3", Age: 32, ModifiedDate: "\/Date(1078992096827)\/" },
// 		{ ID: 4, Name: "test dsf", Age: 32, ModifiedDate: "\/Date(1078992096827)\/" },
// 		{ ID: 3, Name: "Bob ", Age: 27, ModifiedDate: "\/Date(1078992096827)\/" }];

// 	$combo.igCombo({
// 		dataSource: data,
// 		textKey: 'Name',
// 		valueKey: 'ID',
// 	});

// 	$listItems = $combo.igCombo("dropDown").find('.ui-igcombo-listitem');
// 	$input = $combo.igCombo("textInput");
// 	$input.focus();
// 	emulateKeyBoard("down", false, false, false, $input);
// 	emulateKeyBoard("down", false, false, false, $input);
// 	emulateNonSpecialKeyPress(13, $input);
// 	stop();
// 	setTimeout(function () {
// 		start();
// 		equal($combo.igCombo("dropDownOpened"), false, "Combo drop down should be closed");
// 	}, 1000);
// });

// // Bug #236423
// test(testId_23, function() {
// 	var data, $input, $listItems,
// 		$combo = $("#combo-bug-236423"),
// 		evtCanceled = false, evtDone = false;

// 	data = ["test", "test1", "test2"];

// 	$combo.igCombo({
// 		animationShowDuration: 0,
// 		animationHideDuration: 0,
// 		dataSource: data,
// 		itemTemplate: '<span>${value}</span>',
// 		autoSelectFirstMatch: false,
// 		allowCustomValue: true,
// 		filteringType: "none",
// 		selectionChanging: function (evt, ui) {
// 			if (ui.items.length <= 0 || ui.items[0].data.text=="test") {
// 				evtDone = true;
// 				return true;
// 			}
// 			evtCanceled = true;
// 			return false;
// 		},
// 	});

// 	$input = $combo.igCombo("textInput");
// 	$listItems = $combo.igCombo("dropDown").find(".ui-igcombo-listitem");

// 	$input.focus();
// 	typeInInput("w", $input);

// 	$combo.igCombo("refreshValue");
// 	equal($combo.igCombo("valueInput").val(), "w", "Custom Value is set");

// 	$combo.igCombo("openDropDown");
// 	clickElement($($listItems[1]));

// 	equal(evtCanceled, true, "Selection event was canceled");
// 	equal($input.val(), "w", "Input text not changed");
// 	equal($combo.igCombo("value"), "w", "Value was not changed");

// 	clickElement($($listItems[0]));

// 	equal(evtDone, true, "Selection event was handled");
// 	equal($input.val(), "test", "Input text changed to reflect selection");
// 	equal($combo.igCombo("value"), "test" ,"Value was changed to reflect selection");
// });