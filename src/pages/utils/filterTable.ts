export function filter(params: any, dataGet: any, keys: string[]) {
  let data: any = [...dataGet];
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (params[key]) {
      const searchKeyword = params[key].toLowerCase(); // 搜索关键字，转为小写方便忽略大小写
      // 进行模糊搜索过滤
      key = key == 'num' ? 'id' : key;
      data = data.filter((item: any) => item[key].toLowerCase().includes(searchKeyword));
    }
  }

  return data;
}
