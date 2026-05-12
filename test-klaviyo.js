const klaviyoPublicKey = 'QWmkMT';
const klaviyoData = {
    data: {
        type: 'event',
        attributes: {
            properties: { test: "data" },
            metric: {
                data: {
                    type: 'metric',
                    attributes: { name: 'Completed Quiz' }
                }
            },
            profile: {
                data: {
                    type: 'profile',
                    attributes: {
                        email: "test_klaviyo_" + Date.now() + "@example.com",
                        first_name: "Test",
                        properties: { test: "data" }
                    }
                }
            }
        }
    }
};

fetch(`https://a.klaviyo.com/client/events/?company_id=${klaviyoPublicKey}`, {
    method: 'POST',
    headers: {
        accept: 'application/json',
        revision: '2024-02-15',
        'content-type': 'application/json'
    },
    body: JSON.stringify(klaviyoData)
})
.then(async res => {
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
})
.catch(err => console.error(err));
