const db = require('../../data/dbConfig');

async function add(user){
    const [id] = await db('users').insert(user)
    return findById(id)
}

function findById(id){
    return db('users')
        .select('users.id', 'users.username', 'users.password')
        .where('users.id', id)
        .first()
}

function findBy(filter){
    return db('users').where(filter)
}

module.exports = {
    add, 
    findById,
    findBy,
}