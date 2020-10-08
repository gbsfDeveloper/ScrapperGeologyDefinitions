let db = require('./db.js');
let scrapper = require('./scrapper.js');



async function Srap(){
    let result = await scrapper.getInformation();
    let conn = db.startConnection();
    for(const element of result){
        conn.query(`INSERT INTO \`geologyterms\`(\`main_title\`, \`main_text\`, \`main_html\`, \`eng_text\`, \`eng_html\`) VALUES ('${element['main_title']}','${element['main_text']}','${element['main_html']}','${element['eng_text']}','${element['eng_html']}')`, function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results.affectedRows,results.insertId);
        });
    }   
    db.endConnection(conn);
}

Srap();