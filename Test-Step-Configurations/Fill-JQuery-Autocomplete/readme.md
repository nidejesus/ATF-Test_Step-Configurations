## Form Fields

- Name: Click UI Element (Custom)
- Active: True
- Step Environment: UI
- Category: Custom UI
- Template reminder: Click a UI element that you find with a JQuery selector
- Order: 1,300
- Application: \<The name of your application>
- Batch order constraint: Run in the middle of a batch execution

## Inputs Variables

_Double Click_ will determine if the test clicks an element twice with a short delay in between clicks.

- Type: True/False
- Label: Double Click
- Column name: u_double_click

_Query Selector_ is the element that you want to click.

- Type: String
- Label: Query Selector
- Column name: u_query_selector
- Max length: 500
