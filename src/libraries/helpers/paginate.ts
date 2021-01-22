export default function paginate (collection: String[], limit: number, page: number = 1) {
  const from  =  ((page - 1 )*limit);
  const to = ((page)*limit);
  const result = [];
  for (let iterator = from; iterator < to; ++iterator) {
    if (collection[iterator] === undefined) break;
    result.push(collection[iterator]);
  }
  return result;
}