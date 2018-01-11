export const setCsvDataToStore = (data, categories) => {
    return (dispatch, getState) => {
      dispatch({
          type: 'CSV_DATA_RECIEVED',
          "payload" : data,
          "categories" : categories
      })
    }
}
