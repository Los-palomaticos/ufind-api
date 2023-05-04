const Wallet = require('../models/Wallet.model');
const Photo = require('../models/Photo.model');
const Post = require('../models/Post.model');
const SavedPost = require('../models/SavedPost.model');
const Transaction = require('../models/Transaction.model');
const User = require('../models/User.model');
const Message = require('../models/Message.model');

(async ()=>{    
    // relacion wallet a transaccion 1 a n
    Wallet.hasMany(Transaction, {
        foreignKey: 'wallet_id'
    })
    Transaction.belongsTo(Wallet, {
        foreignKey: 'wallet_id'
    })

    // relacion usuario a wallet 1 a 1
    User.hasOne(Wallet, {
        foreignKey: 'wallet_id'
    })
    Wallet.belongsTo(User, {
        foreignKey: 'wallet_id'
    })

    // relacion usuario a mensaje 1 a n
    User.hasMany(Message, {
        foreignKey: 'user_id'
    })
    Message.belongsTo(User, {
        foreignKey: 'user_id'
    })

    // Relacion post y usuario n a n con tabla SavedPosts
    Post.belongsToMany(User, {
        through: SavedPost,
        foreignKey: 'post_id'
    });
    User.belongsToMany(Post, {
        through: SavedPost,
        foreignKey: 'user_id'
    });
    // Movie.belongsToMany(Actor, { through: 'ActorMovies' });
    // Relacion entre photo y post 1 a n
    Post.hasMany(Photo,{
        foreignKey: 'post_id'
    })
    Photo.belongsTo(Post, {
        foreignKey: 'post_id'
    })

    // Relacion entre Usuario y Post 1 a n
    User.hasMany(Post, {
        foreignKey: 'user_id'
    })
    Post.belongsTo(User, {
        foreignKey: 'user_id'
    })
    
    await User.sync()
    await Wallet.sync()
    await Transaction.sync()
    await Message.sync()
    await Post.sync()
    await SavedPost.sync()
    await Photo.sync()

    console.log('Tables created')
})();
