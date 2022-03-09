# Hodomojo Coding Exercise Solutions

The goal of these exercises are to assess your proficiency in software engineering that is related to the daily work that we do at Hodomojo. Please follow the instructions below to complete the assessment.

# Documentation

**Add ride**

- **URL** : /rides

- **Method**: POST
- **Required Fields** :
  1. start_lat
  2. start_long
  3. end_lat
  4. end_long
  5. rider_name
  6. driver_name
  7. driver_vehicle
- **response sample**
  ```json
  {
    "rideID": 1,
    "startLat": 17,
    "startLong": 19,
    "endLat": 19,
    "endLong": 17,
    "riderName": "Gulshan",
    "driverName": "utsav",
    "driverVehicle": "cycle",
    "created": "2022-03-09 14:06:03"
  }
  ```

**Get Rides**

- **URL**: /rides?page=1
- **Method**: GET
- **response sample**
  ```json
  [
    {
      "rideID": 1,
      "startLat": 17,
      "startLong": 19,
      "endLat": 19,
      "endLong": 17,
      "riderName": "Gulshan",
      "driverName": "utsav",
      "driverVehicle": "cycle",
      "created": "2022-03-09 14:06:03"
    }
  ]
  ```

**Get Particular Ride**

- **URL**: /rides/:id
- **METHOD**: GET
- **response sample**
  ```json
  {
    "rideID": 1,
    "startLat": 17,
    "startLong": 19,
    "endLat": 19,
    "endLong": 17,
    "riderName": "Gulshan",
    "driverName": "utsav",
    "driverVehicle": "cycle",
    "created": "2022-03-09 14:06:03"
  }
  ```

### Implemented Tool

These tool are implemented.

1. `eslint` - for linting
2. `nyc` - for code coverage
3. `pre-push` - for git pre push hook running tests
4. `winston` - for logging

### Pagination Implemented

> pagination implemented on GET /rides on single page 2 rides are allowed


### Security

> Prevent Sql injection
