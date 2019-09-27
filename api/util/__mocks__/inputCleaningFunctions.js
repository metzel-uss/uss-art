const inputCleaningFunctions = jest.genMockFromModule('../inputCleaningFunctions');

inputCleaningFunctions.inputArrayFunc = jest.fn()
  .mockImplementation(arr => arr.map(a => a.replace(/;/gi, '\\;').replace(/:/gi, '\\:')).join(';'))
  .mockName("inputArrayFunc");
inputCleaningFunctions.outputArrayFunc = jest.fn()
  .mockImplementation(arr => arr.split(/(?<!\\);/).map(value => value.replace(/\\;/gi, ';').replace(/\\:/gi, ':')))
  .mockName("outputArrayFunc");

inputCleaningFunctions.inputObjectFunc = jest.fn()
  .mockImplementation(obj =>
    Object.keys(obj).map(k => `${k.replace(/;/gi, '\\;').replace(/:/gi, '\\:')}:${obj[k].replace(/;/gi, '\\;').replace(/:/gi, '\\:')}`).join(';')
  )
  .mockName("inputObjectFunc");
inputCleaningFunctions.outputObjectFunc = jest.fn()
  .mockImplementation(objString => {
    const arr = objString.split(/(?<!\\);/);
    const elementOptions = {};
    for (let i = 0; i < arr.length; i++) {
      let [key, value] = arr[i].split(/(?<!\\):/);
      elementOptions[key.replace(/\\;/gi, ';').replace(/\\:/gi, ':')] = value.replace(/\\;/gi, ';').replace(/\\:/gi, ':');
    }
    return elementOptions;
  })
  .mockName("outputObjectFunc");

module.exports = inputCleaningFunctions;
