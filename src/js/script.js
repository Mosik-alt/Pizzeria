/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initOrderForm();
      thisProduct.processOrder();


      console.log('new Product:', thisProduct);
    }

    renderInMenu() {
      const thisProduct = this;
      /*generate HTML based on temple*/
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /*create element using utils.createElementFromHTML*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /*find menu container*/
      const menuContainer = document.querySelector(select.containerOf.menu);
      /*add element to menu*/
      menuContainer.appendChild(thisProduct.element);

    }

    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    }

    initAccordion() {
      const thisProduct = this;

      /*find the clickable trigger (element that should react to clicking)*/
      const clickableTigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      console.log('wyszukany element'),
        /*START : click event listener to trigger*/
        clickableTigger.addEventListener('click', function (event) {
          /*prevent default action for event*/
          event.preventDefault();
          /* toggle active class on element of thisProduct */
          thisProduct.element.classList.toggle('active');
          /* find all active products */
          const allActiveProducts = document.querySelectorAll('.product.active');
          /* START LOOP: for each active product */
          for (let activeProduct of allActiveProducts) {
            /* START: if the active product isn't the element of thisProduct */
            if (thisProduct.element != activeProduct) {
              /* remove class active for the active product */
              activeProduct.classList.remove('active');
              /* END: if the active product isn't the element of thisProduct */
            }
            /* END LOOP: for each active product */
          }
          /* END: click event listener to trigger */
        });
    }
    initOrderForm() {
      const thisProduct = this;
      console.log('initOrderForm');
      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

    processOrder() {
      // this Product odnosi się do 4 instalacji o klasie Produkt jest ich 4 i przedstawia on każdą z osobna//
      const thisProduct = this;


      //wraca z formularza wartości name i value - wiemy jakie dodatki klient zamówił np do pizzy name o kluczu: toppings value: oliwki i salami//
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);

      /* set variable price to equal thisProduct.data.price */
      // zmienna zapisuje domyślną cenę produktu, ale dlaczego 'data' a nie 'dataSource' z data.js?//
      let price = thisProduct.data.price;

      //START LOOP: for each paramId in thisProduct.data.params//
      //są również składniki odhaczone należy je znaleść po wszystkich params, ale gdzie jest checked? //
      for (let paramId in thisProduct.data.params) {
        // stała ma wartość wszystkich wybranych dodatków wykorzystujemy tablicę po wszystkich dodatkach "params"//
        const paramsValue = thisProduct.data.params[param];
        /* START LOOP: for each optionId in param.options */
        //gdzie jest optionID? //
        for (let optionID in thisProduct.param.options) {
          /* save the element in param.options with key optionId as const option */
          const optionValue = thisProduct.param.options[option];
          /* START IF: if option is selected and option is not default */
          if (formData) {
            if (formData.option && optionValue.default) {
              /* add price of option to variable price */
              price += optionValue.price
              /* END IF: if option is selected and option is not default */
              if (!formData.option) {
                price -= optionValue.price;
              }
              /* START ELSE IF: if option is not selected and option is default */
              /* deduct price of option from price */
              else if (optionValue.default && !formData.option) {
                price -= optionValue.price;
                /* END ELSE IF: if option is not selected and option is default */
              }
              /* END LOOP: for each optionId in param.options */
            }
            /* END LOOP: for each paramId in thisProduct.data.params */
          }
          /* set the contents of thisProduct.priceElem to be the value of variable price */

          const app = {

            initData: function () {
              const thisApp = this;
              thisApp.data = dataSource;
            },

            initMenu: function () {
              const thisApp = this;
              console.log('thisApp.data:', thisApp.data);

              for (let productData in thisApp.data.products) {
                new Product(productData, thisApp.data.products[productData]);
              }
            },

            init: function () {
              const thisApp = this;
              console.log('*** App starting ***');
              console.log('thisApp:', thisApp);
              console.log('classNames:', classNames);
              console.log('settings:', settings);
              console.log('templates:', templates);

              thisApp.initData();
              thisApp.initMenu();

            },
          };
          app.init();
        };
