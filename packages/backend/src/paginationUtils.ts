export const paginateResponse = (result) => {
  const responseBody = {
    results: result.docs,
    hasNext: result.hasNextPage
  };
  if (result.hasPrevPage == false) {
    responseBody["hasPrevious"] = false;
  } else {
    if (result.docs.length > 0) {
      responseBody["previous"] = result.docs.at(0)._id;
    }
  }
  if (result.hasNextPage) {
    responseBody["next"] = result.docs.at(-1)._id;
  }
  return responseBody;
};
export const paginateOptions = (query, select, limit, pagingNext, pagingPrevious) => {
  const options = {limit: limit, select: select};
  if (query) {
    options["query"] = query;
  }
  if (pagingNext) {
    options["startingAfter"] = pagingNext;
  } else {
    if (pagingPrevious) {
      options["endingBefore"] = pagingPrevious;
    }
  }
  return options;
}