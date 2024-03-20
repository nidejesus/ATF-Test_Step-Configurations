## Form Fields

- Name: Set UI Element (Custom)
- Active: True
- Step Environment: UI
- Category: Custom UI
- Template reminder: Set a UI element that you find with a JQuery selector.
- Order: 1,300
- Application: \<The name of your application>
- Batch order constraint: Run in the middle of a batch execution

## Inputs Variables

_Value_ is the value you want to set the element to.

- Type: String
- Label: Value
- Column name: u_value
- Max length: 100

_Query Selector_ is the element that you want to change the value of.

- Type: String
- Label: Query Selector
- Column name: u_query_selector
- Max length: 500

_Index of Element_ is the index of the element that you want to select. If the query returns multiple results use this index to select the one you want.

- Type: Integer
- Label: Index of Element
- Column name: u_index_of_element
