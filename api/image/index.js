module.exports = async function (context, req) {
    var file = context.bindings.imagefileBlob;
    context.res = {
        body: file
    };
}