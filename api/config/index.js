module.exports = async function (context, req) {
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {           
            login:process.env.VUE_APP_STRAPI_USER,
            password: process.env.VUE_APP_STRAPI_PASSWORD,
            host: process.env.VUE_APP_STRAPI_API                  
        }
    };
}