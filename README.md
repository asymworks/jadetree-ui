Jade Tree UI Library
--------------------

Use as NPM (requires bundler for imported CSS):
```typescript
import JtAutocomplete from '@jadetree/ui';

// Register the Web Component
JtAutocomplete.register();

// Create a new Web Component
const host = document.createElement('div');
host.innerHTML = `
<jt-autocomplete>
    <input type="text" list="options" />
    <datalist id="options">
        <option>Apples</option>
        <option>Bananas</option>
        <option>Cereal</option>
    </datalist>
</jt-autocomplete>
`;
```

Use in browser as ES6 Module
```html
<head>
    <link rel="stylesheet" href="https://unpkg.com/@jadetree/ui/css/autocomplete.min.css" />
</head>
<body>
    <div>
        <jt-autocomplete>
            <input type="text" list="options" />
            <datalist id="options">
                <option>Apples</option>
                <option>Bananas</option>
                <option>Cereal</option>
            </datalist>
        </jt-autocomplete>
    </div>
    <script type="module">
        import JtAutocomplete from 'https://unpkg.com/@jadetree/ui';

        // Register the Web Component
        JtAutocomplete.register();
    </script>
</body>
```

Use in browser as IIFE
```html
<head>
    <link rel="stylesheet" href="https://unpkg.com/@jadetree/ui/css/autocomplete.min.css" />
    <script src="https//unpkg.com/@jadetree/ui/dist/components/autocomplete.iife.min.js"></script>
</head>
<body>
    <div>
        <!-- the web component is automatically registered by the IIFE -->
        <jt-autocomplete>
            <input type="text" list="options" />
            <datalist id="options">
                <option>Apples</option>
                <option>Bananas</option>
                <option>Cereal</option>
            </datalist>
        </jt-autocomplete>
    </div>
</body>
```

## User-Defined Item Templates
The `JtAutocomplete` and `JtSelect` support user-defined templates for listbox
items, which allow the developer to define custom markup for each list entry.
Use these with care, as the inner HTML of the `<template>` tag is evaluated
with the JavaScript interpreter. **Do not pass user-defined input to the item
template without first sanitizing it**.