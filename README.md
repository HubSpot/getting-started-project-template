Create CRM cards in a Custom Tab
================================

Create custom CRM cards in the new custom tab available on contact, company, deal, and ticket records. You can use a custom CRM card to display information from external systems, or to organize specific HubSpot information across CRM records.

In this short guide we'll highlight the new features available for CRM Card extensions, as well as how to use the Projects tool to create a custom card displayed in the middle of the CRM record page.


Step 1: Getting started with HubSpot Projects
---------------------------------------------

Custom CRM Card extensions are built on the HubSpot Developer Platform, and you will use the new Projects tool to build and deploy your extension. Make sure you're gone through these prerequisites to ensure your portal is configured correctly and you're ready to start building:

 - [Quick start guide for developing with projects](https://developers.hubspot.com/docs/platform/projects-quick-start-guide) using the "Getting Started" app template
 - [Create CRM cards with projects](https://developers.hubspot.com/docs/platform/create-custom-crm-cards-with-projects) to review the [components](https://developers.hubspot.com/docs/platform/create-custom-crm-cards-with-projects#available-ui-components) and other [new features](https://developers.hubspot.com/docs/platform/create-custom-crm-cards-with-projects#adding-actions) available in CRM Sidebar Cards

**Note:** Use the password from your email invitation for all documentation linked here.

Following the tutorial above, you should now have a card extension that looks similar to this:

<img width="413" alt="Screen Shot 2022-05-02 at 10 50 05 AM" src="https://user-images.githubusercontent.com/30241/166263516-69f1a1b4-6a4b-463e-9111-e4fac4cfa896.png">


Step 2: Moving your Card into the new Custom Tab area
-----------------------------------------------------

Next, we'll convert your card extension to display in the new custom tab. We need to make two changes to move the card to its new location: 1) update the card configuration and 2) update the serverless function to use the new request/response APIs.


### Update card configuration

For this alpha release, we use the `version: 2` config option to distinguish Custom Tab cards from Sidebar cards. This will likely change in an upcoming release, but for now this is the primary change needed to use the new extension area:

`app.json`
```diff
"extensions": {
    "crm": {
        "cards": [
            {
-              "file": "./crm-card.json",
+              "file": "./crm-card.json",
+              "version": 2
            }
        ]
```

`crm-card.json`
```diff
{
  "type": "crm-card",
+ "version": 2,
  "data": {
    "title": "Simple Card",
    "fetch": {
      "targetFunction": "crmCard",
```

Once that's complete, use the `hs project` CLI to build and deploy your project. For simple cards, that may be all that's required, and you'll see your card in the custom tab. If your card does not work after that change, we'll need to make a couple small changes to the serverless request/response API to get things working again.


### Use updated Serverless function API


#### Request

##### Arguments

The [two primary arguments to serverless functions](https://developers.hubspot.com/docs/platform/serverless-functions#hs_cos_wrapper_widget_1642786408502) – `context` and `callback` – are nearly identical to the sidebar card extensions, with a few small exceptions noted here.

 - `callback` (a.k.a. `sendResponse`): this function is identical for both card types
 - `context`: contains information about the CRM Record being viewed, including:
   + `context.secrets` containing [authentication tokens and passwords for third-party services](https://developers.hubspot.com/docs/platform/serverless-functions#including-secrets-in-a-function), including the auto-generated `context.secrets.PRIVATE_APP_ACCESS_TOKEN` which you can use to [make authenticated HubSpot API calls](https://developers.hubspot.com/docs/platform/serverless-functions#authenticate-hubspot-api-calls) from inside your serverless function.
   + `context.propertiesToSend` contains key/value pairs for all CRM Properties you asked to be provided. For example, if you configured your function to receive a Contact's firstname, you would access that via `context.propertiesToSend.firstname`

**Important:** If you previously configured `propertiesToSend` in a sidebar card and you want to convert that to a custom tab card, you'll need to change how you retrieve property values in the `context` argument (see above for details):

```diff
exports.main = async (context = {}, sendResponse) => {
-  const { firstname } = context;
+  const { propertiesToSend: { firstname } } = context;
  
  sendResponse({
```

#### Response

`crm-card.js` – This API change is optional but recommended. We've simplified the JSON response by removing unnecessary boilerplate. All that's needed to render a custom tab card is an object with an array of card `sections`, containing any [standard components](https://developers.hubspot.com/docs/platform/create-custom-crm-cards-with-projects#available-ui-components) or the tab-specific components listed below.

```diff
  sendResponse({
-   results: [
-     {
-       objectId: 1,
-       title: `Simple card example`,
        sections: [
          {
            type: 'text',
            format: 'markdown',
            text: `Hello, world!`
          }
        ]
-     }
-   ]
  });
```

Once you've finished these API changes, your card should render in the new custom tab on the CRM Record. If it's still not working, you can get help in the slack support channel or use [the Logs feature for your Private App](https://developers.hubspot.com/docs/api/private-apps) to help troubleshoot.


Step 3: Additional Card customization
-------------------------------------

## Additional components

All [components available for sidebar cards](https://developers.hubspot.com/docs/platform/create-custom-crm-cards-with-projects#available-ui-components) can also be used inside a custom tab, while the additional components listed here were built specifically for use in the custom tab layout:

### `crm::table`

Display a table of CRM data for a given object type. The list of properties become table columns, and you can use the `pageSize` to control how much data you see at once.


| Prop | Type | Required? | Description |
| --- | --- | --- | --- |
| `objectTypeId` | `string` | yes | An object's objectTypeId, e.g. "0-1" (Contacts) |
| `properties` | `Array<string>` | yes | The object properties to show as columns in the table |
| `pageSize` | `number` | no | Maximum number of table rows to show per page. Defaults to 10 |


<details>
  <summary>Examples</summary>

<table>
  <thead>
    <tr>
      <th align="left">Example</th>
      <th align="left">Preview</th>
    </tr>
  </thead>
<tbody>
<tr>
<td>

```js
{
  "type": "crm::table",
  "objectTypeId": "0-1",
  "properties": [
    "firstname",
    "lastname",
    "email"
  ],
  "pageSize": 3
}
```

</td>
<td>

<img width="815" alt="Screen Shot 2022-04-24 at 8 21 28 PM" src="https://user-images.githubusercontent.com/30241/166264265-ff4e8145-aef0-430b-9a30-819251b6004e.png">
 

</td>

</tr>
</tbody>
</table>

</details>

---


### `crm::propertyList`

Built on top of the [Description List](https://developers.hubspot.com/docs/platform/create-custom-crm-cards-with-projects#description-list), this component provides a shortcut for displaying a list of properties for your CRM objects. Rather than handling the data fetching and property formatting yourself, just declare which properties you want to see and let the CRM handle the rest.

| Prop | Type | Required? | Description |
| --- | --- | --- | --- |
| `objectTypeId` | `string` | yes | An object's objectTypeId, e.g. "0-1" (Contacts) |
| `objectId` | `string` | yes | The id of the specific object CRM object to display the properties from |
| `properties` | `Array<string>` | yes | The object properties to show within the list |
| `direction` | `"row"`, `"column"` | no | The direction that properties will be visually laid out, defaults to `"column"` |


<details>
  <summary>Examples</summary>


<table>
  <thead>
    <tr>
      <th align="left">Example</th>
      <th align="left">Preview</th>
    </tr>
  </thead>
<tbody>
<tr>
<td>

```js
{
  "type": "crm::propertyList",
  "objectTypeId": "0-1",
  "objectId": "51",
  "properties": [
    "firstname",
    "lastname",
    "company",
    "email",
    "phone"
  ],
}
```

</td>
<td>
<img width="496" alt="Screen Shot 2022-04-24 at 7 53 03 PM" src="https://user-images.githubusercontent.com/30241/166263943-c5bf70cc-226a-4eaf-ac4a-6fe2be6a1d56.png">

</td>
</tr>

<tr>
<td>

```diff
{
  "type": "crm::propertyList",
+  "direction": "row"
  "objectTypeId": "0-1",
  "objectId": "51",
  "properties": [
    "firstname",
    "lastname",
    "company",
    "email",
    "phone"
  ],
}
````

</td>
<td>
 
 <img width="678" alt="Screen Shot 2022-04-24 at 7 53 38 PM" src="https://user-images.githubusercontent.com/30241/166264064-c251754c-24ac-4fdb-ab73-f7d145fb699c.png">

</td>
</tr>
</tbody>
</table>

</details>
