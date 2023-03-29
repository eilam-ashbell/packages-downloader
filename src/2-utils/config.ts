class Config {
    public devMode = true;
    public packagesDir = `${__dirname}/../../node_modules/`;
    public logDir = `${__dirname}/../8-temp/logs/`;
    public tarballDir = `${__dirname}/../8-temp/packages/`;
    public zipDir = `${__dirname}/../8-temp/zips/`
}

const config  = new Config()

export default config;
