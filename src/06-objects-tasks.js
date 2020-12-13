/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const obj = {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
  return obj;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const properties = Object.values(obj);

  return new proto.constructor(...properties);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {

  resultString: '',

  element(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.order = 1;
    obj.resultString = `${this.resultString}${value}`;
    this.checkOrder(obj.order);
    this.checkUnique(obj.order);
    return obj;
  },

  id(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.order = 2;
    obj.resultString = `${this.resultString}#${value}`;
    this.checkOrder(obj.order);
    this.checkUnique(obj.order);
    return obj;
  },

  class(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.order = 3;
    obj.resultString = `${this.resultString}.${value}`;
    this.checkOrder(obj.order);
    return obj;
  },

  attr(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.order = 4;
    obj.resultString = `${this.resultString}[${value}]`;
    this.checkOrder(obj.order);
    return obj;
  },

  pseudoClass(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.order = 5;
    obj.resultString = `${this.resultString}:${value}`;
    this.checkOrder(obj.order);
    return obj;
  },

  pseudoElement(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.order = 6;
    obj.resultString = `${this.resultString}::${value}`;
    this.checkOrder(obj.order);
    this.checkUnique(obj.order);
    return obj;
  },

  combine(selector1, combinator, selector2) {
    const obj = Object.create(cssSelectorBuilder);
    obj.resultString = `${selector1.resultString} ${combinator} ${selector2.resultString}`;
    return obj;
  },

  checkOrder(el) {
    if (this.order > el) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  },

  checkUnique(el) {
    if (this.order === el && [1, 2, 6].includes(el)) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  },

  stringify() {
    return this.resultString;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
