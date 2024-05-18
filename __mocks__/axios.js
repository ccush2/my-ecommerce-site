const axios = jest.genMockFromModule("axios");

axios.create = jest.fn().mockReturnValue(axios);

axios.get = jest.fn();
axios.post = jest.fn();
axios.put = jest.fn();
axios.delete = jest.fn();

export default axios;
