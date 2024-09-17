# Test API

Welcome to the test API.

## Requirements

- Node.js (>= 18.x)
- npm (>= 10.x)

## Usage

1. set env variables: copy from .env.expample

2. Start the server dev mode:

    ```bash
    npm start
    ```

The API will be available at `http://localhost:3000`.

## Endpoints

- `GET /api/v1/new-listings` - Retrieves a line chart with the new listings.
- `GET /api/v1/average-revenue` - Retrieves a line chart with the average revenue.
- `GET /api/v1/data-table` - Retrieves table with the data. You can filter results using query parameters
```bash
curl -X GET "http://localhost:3000/api/v1/data-table?sort=listing_id&direction=asc"
```