module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    if(req.method=="POST"){
        const datam =  (req.body && req.body.datam);
        if (datam){
            context.bindings.messageList=[];
            context.bindings.messageList.push(datam);
        }

        const responseMessage = name
            ? "Hello, " + name + ". This HTTP triggered function executed successfully."
            : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: responseMessage
        };
    } else if (req.method=="GET"){
        var id = context.bindingData.id;
        if (id){
            context.res = {
                body: context.bindings.existingMessageList
            }
        }else{
            context.res = {
                body: context.bindings.allExistingMessageList
            }

        }
    }
}