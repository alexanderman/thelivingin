/** this is workaround to copy mocks into  client dir, since react-create-app restricts folders outside project dir */

const fs = require('fs-extra');

fs.copy('../_mocks', './src/._mocks-copy', err => {
    if (err) {
        return console.error(err);
    }
    console.log('copied mocks successfully');
});
