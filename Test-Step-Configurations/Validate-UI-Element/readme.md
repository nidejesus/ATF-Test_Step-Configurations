## Form Fields

- Name: Validate UI Element (Custom)
- Active: True
- Step Environment: UI
- Category: Custom UI
- Template reminder: Validate a UI element that you find with a JQuery selector is on the page
- Order: 1,300
- Application: \<The name of your application>
- Batch order constraint: Run in the middle of a batch execution

## Inputs Variables

_Specific Validation Type_ will determine what type of validation to run.

- Type: True/False
- Label: Specific Validation Type
- Column name: u_validation_type
- Column name: u_validation_type
- Choices:
    * Not Read Only
       * Value: not_read_only
       * Label: Not Read Only 
       * Module Type: INCIDENT & SERVICE REQUEST
    * Read Only
       * Value: read_only
       * Label: Not Read Only 
       * Module Type: INCIDENT & SERVICE REQUEST
    * Visible
       * Value: visible
       * Label: Visible 
       * Module Type: INCIDENT & SERVICE REQUEST

_Query Selector_ is the element that you want to click.

- Type: String
- Label: Query Selector
- Column name: u_query_selector
- Max length: 500
- Mandatory: True
