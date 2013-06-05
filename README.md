dryselect
=========

URL: https://github.com/amaxwell01/dryselect

Advanced selection elements

Normal creation example
```javascript
dryselect.create({
    name: 'dryselect_example',
    checkboxes: true,
    values: [
        {
            title: 'One', // String or Num
            value: '1', // string or num or boolean
            itemClass: '', // string
            itemID: '' // string
        },
        {
            title: 'Two', // String or Num
            value: '2', // string or num or boolean
            itemClass: '', // string
            itemID: '' // string
        }
     ]
});
```

Selected all, none or specific values
```javascript
dryselect.select({
    name: 'dryselect_example',
    values: ['1']
});

dryselect.select({
    name: 'dryselect_example',
    values: 'all'
});

dryselect.select({
    name: 'dryselect_example',
    values: 'none'
});
```

Get the selected count
```javascript
dryselect.count({
    name: 'dryselect_example'
})
```

Get the count of selected, non-selected and all items
```javascript
var total = dryselect.get({ name: 'dryselect_example' });
console.log( total );
```

Set values in the select
```javascript
dryselect.set({
    name: 'dryselect_example',
    values: [
        {
            value: 1,
            title: 'One Hundred',
            newValue: 100
        }
    ]
});
```

New Set options coming soon!
```javascript
dryselect.set({
    name: 'dryselect_example',
    enabled: false
});
```

New drag to selection options coming soon!
```javascript
dryselect.create({
    name: 'dryselect_example', // Required
    checkboxes: true, // defaults to false
    dragToSelect: true, // defaults to false
    values: [
        {
            title: 'One', // String or Num
            value: '1', // string or num or boolean
            itemClass: '', // string
            itemID: '' // string
        },
        {
            title: 'Two', // String or Num
            value: '2', // string or num or boolean
            itemClass: '', // string
            itemID: '' // string
        }
    ] // Required for content, but not required for creation
});
```
