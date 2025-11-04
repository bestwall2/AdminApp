# How to Use Your Google Sheets Web App API

This guide provides a step-by-step walkthrough on how to interact with your Google Sheets Web App API from a frontend application.

## API Base URL

All API calls will be made to the following base URL:

`https://script.google.com/macros/s/AKfycbzfxNL3ZrnpwbgryyrRyvw-qpGwq7kd1TcdhMpvMoN_xaE7TJNK2uZaXQu6b33r_5e6/exec`

---

## 1. Get All Codes (`func=get`)

This function retrieves all the data from your Google Sheet.

### How to Use

Make a `GET` request to the following URL:

`[BASE_URL]?func=get`

### Example Response

The API will return a JSON object with a `status` and a `data` array. Each object in the `data` array represents a row and includes the `row` number and the data from the `Codes` column.

```json
{
  "status": "success",
  "data": [
    { "row": 2, "Codes": "EDIT123" },
    { "row": 3, "Codes": "NEW12" },
    { "row": 4, "Codes": "jdida" },
    { "row": 5, "Codes": "Wbwbdjd" },
    { "row": 6, "Codes": "Dgdh" }
  ]
}
```

---

## 2. Add a New Code (`func=add`)

This function adds a new row to your Google Sheet.

### How to Use

Make a `GET` request to the following URL, including the new code as a query parameter:

`[BASE_URL]?func=add&Codes=NEWCODE123`

Replace `NEWCODE123` with the code you want to add.

---

## 3. Edit a Code (`func=edit`)

This function edits a specific cell in your Google Sheet.

### How to Use

Make a `GET` request with the following query parameters:

- `func=edit`
- `row`: The row number of the cell to edit.
- `col`: The column number of the cell to edit.
- `newValue`: The new value for the cell.

**Example:** To change the code in row 3 to "UPDATEDCODE", the URL would be:

`[BASE_URL]?func=edit&row=3&col=1&newValue=UPDATEDCODE`

### How to Get `row` and `col` Numbers

- **`row`**: You can get the `row` number from the objects returned by the `get` function. In the example response above, the code "NEW12" is in `row: 3`.
- **`col`**: Since your data only has one column (`Codes`), the column number will always be `1`.

---

## 4. Delete a Code (`func=delete`)

This function deletes a row from your Google Sheet.

### How to Use

Make a `GET` request with the following query parameters:

- `func=delete`
- `row`: The row number to delete.

**Example:** To delete row 4, the URL would be:

`[BASE_URL]?func=delete&row=4`

### How to Get the `row` Number

You can get the `row` number from the objects returned by the `get` function. In the example response, the code "jdida" is in `row: 4`.

---

## How to Handle Row and Column Numbers

When you fetch your data using the `get` function, the API returns an array of objects, where each object represents a row in your sheet. The `row` number is conveniently included in each of these objects.

**Example `get` Response Object:**

```json
{
  "row": 3,
  "Codes": "NEW12"
}
```

- **`row`**: This is the actual row number in your Google Sheet. When you need to `edit` or `delete` a specific entry, you simply use this `row` value.

- **`col`**: The column number corresponds to the position of the column in your sheet. Since your data only contains the `Codes` column, the column number will always be `1`. If you were to add more columns to your sheet (e.g., a "Description" column in the second position), its column number would be `2`.

---

## Tips for Integrating into an Admin Dashboard

Here are a few tips to ensure a smooth and safe integration of this API into your admin dashboard:

1.  **Error Handling**: The Google Sheets API might occasionally fail or return an error. You should wrap your `fetch` calls in `try...catch` blocks to handle any potential network errors or issues with the API. This will prevent your application from crashing and allow you to display a user-friendly error message.

2.  **User Feedback**: Since the API calls involve network requests, they may take a moment to complete. Provide feedback to the user to indicate that something is happening in the background. For example, you can show a loading spinner while the data is being fetched, and display a success or error message after an `add`, `edit`, or `delete` operation.

3.  **Security**: Be aware that your Google Sheets Web App URL is public. Anyone with the URL can access the API. For a simple admin dashboard, this might be acceptable, but for sensitive data, you should consider adding a layer of authentication. This could be a simple secret key passed as a query parameter or a more robust authentication method implemented in your Google Apps Script.

4.  **Rate Limiting**: Google Apps Script has quotas and limitations on the number of requests you can make per day. For a small admin dashboard, you are unlikely to hit these limits, but it's good to be aware of them. Avoid making an excessive number of requests in a short period.
