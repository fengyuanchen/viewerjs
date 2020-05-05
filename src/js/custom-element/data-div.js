import CryptoJS from 'crypto-js';

function encrypt(data) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
}

function decrypt(data) {
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
}

class DataDiv extends HTMLElement {
  get attributes() {
    return this.dataset;
  }

  set attributes(dataset) {
    if (dataset) {
      Object.entries(dataset).forEach(([key, value]) => {
        const data = encrypt(value);
        this.dataset[key] = data;
      });
    } else {
      Object.entries(dataset).forEach(([key]) => {
        delete this.dataset[key];
      });
    }
  }

  getData(attribute) {
    const normalizedAttribute = attribute.replace(/^(data-)/, '');
    const encryptedData = this.getAttribute(`data-${normalizedAttribute}`);

    return decrypt(encryptedData);
  }
}

customElements.define('data-div', DataDiv);

export default DataDiv;
