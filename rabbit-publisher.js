const amqplib = require('amqplib');

var amqp_url = process.env.RMQ_URL || 'amqp://localhost:5672';

async function produce() {
    console.log("Publishing");
    var connection = await amqplib.connect(amqp_url, "heartbeat=60");
    var channel = await connection.createChannel()
    var exchange = 'ex.in.sms';
    var queue_name = 'smpp_client_sms';
    var routing_key = 'test_route';
    var msg = 'Hello World!';

    await channel.assertExchange(exchange, 'direct', {durable: true}).catch(console.error);
    await channel.assertQueue(queue, {durable: true});
    await channel.bindQueue(queue, exchange, routing_key);
    await channel.publish(exchange, routing_key, Buffer.from(msg));

    setTimeout( function()  {
        ch.close();
        conn.close();},  500 );
}

produce();