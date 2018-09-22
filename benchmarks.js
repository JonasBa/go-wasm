const NativeSearch = (search, array) => {
  const j = array.length;

  const results = []

  for(let i = 0; i < j; i++){
    const item = array[i]
    if(item.name === search){
      results.push(item)
    }
  }

  return results
}

const MarkJSONParseTime = (data) => {
  const start = performance.now()
  data = data.json()
  const end = performance.now()

  console.warn(`SERIALIZING TIME: `, end - start)

  return data
}

const MarkNativeSearchTime = (search, json) => {
  const start = performance.now()
  const results = NativeSearch(search, json.data)
  const end = performance.now()

  console.warn(`SEARCH TIME: `, end - start)

  return results
}

const MarkGoSearchTime = (search, json) => {
  const start = performance.now()

  const results = window.search(search, json)

  const end = performance.now()

  console.warn(`SEARCH IN GO TIME: `, end - start)
  return results
}

const BenchMarkNativeSearch = (file, searchString) => 
  new Promise(resolve => {
    fetch(`./${file}.json`)
    .then(data => {
      console.warn('BENCHMARKING', file)    
      return MarkJSONParseTime(data)
    })
    .then(json => {
      const results = MarkNativeSearchTime(searchString, json)
      console.log('RESULTS: ', results)
      setTimeout(resolve, 1000)
    })
})

const BenchMarkGoSearch = (file, searchString) => 
  new Promise(resolve => {
    fetch(`./${file}.json`)
    .then(data => {
      return data.text()
    })
    .then(json => {
      const results = MarkGoSearchTime(searchString, json)
      console.log('RESULTS: ', window.goValue)
      setTimeout(resolve, 1000)
    })
})

const go = new Go();

WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then((result) => {
  instance = go.run(result.instance);

  // setTimeout(() => {
  // BenchMarkNativeSearch('TestData_10', 'mytesting')
  // BenchMarkNativeSearch('TestData_100', 'mytesting')
  // BenchMarkNativeSearch('TestData_1_000', 'mytesting')
  // BenchMarkNativeSearch('TestData_10_000', 'mytesting')
  // BenchMarkNativeSearch('TestData_100_000', 'mytesting')

  // console.warn('STARTING GO BENCHMARKS')
  // BenchMarkGoSearch('TestData_10', 'mytesting')
  // BenchMarkGoSearch('TestData_100', 'mytesting')
  // BenchMarkGoSearch('TestData_1_000', 'mytesting')
  BenchMarkGoSearch('TestData_100_000', 'mytesting')
  // setTimeout(() => BenchMarkGoSearch('TestData_100_000', 'mytesting'), 1000)
});