const data = {};
const get = (key) => {
    return data[key];
};

const set = (key, value) => {
    return data[key] = value;
};

const del = (key) => {
    delete data[key];
}

const has = key => {
    return keys().includes(key);
}

const keys = () => Object.getOwnPropertyNames(data);

export { get, set, del, has, keys };