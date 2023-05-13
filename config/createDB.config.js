const Wallet = require('../models/Wallet.model');
const Photo = require('../models/Photo.model');
const Post = require('../models/Post.model');
const SavedPost = require('../models/SavedPost.model');
const Transaction = require('../models/Transaction.model');
const User = require('../models/User.model');
const Message = require('../models/Message.model');

(async ()=>{    
    // relacion wallet a transaccion 1 a n
    Transaction.belongsTo(Wallet, {
        foreignKey: {
            name: 'wallet_id',
            allowNull: false
        }
    })

    // relacion usuario a wallet 1 a 1
    Wallet.belongsTo(User, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })

    // relacion usuario a mensaje 1 a n
    User.hasMany(Message, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })

    // Relacion post y usuario n a n con tabla SavedPosts
    Post.belongsToMany(User, {
        through: SavedPost,
        foreignKey: {
            name: 'post_id',
            allowNull: false
        },
        as: "savedPost"
    });
    User.belongsToMany(Post, {
        through: SavedPost,
        foreignKey: {
            name: 'user_id',
            allowNull: false
        },
        as: "saver"
    });

    // Relacion entre photo y post 1 a n
    Post.hasMany(Photo,{
        foreignKey: {
            name: 'post_id',
            allowNull: false
        },
        as:'photos'
    });

    // Relacion entre Usuario y Post 1 a n
    User.hasMany(Post, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        },
        as: "publisher"
    })
    Post.belongsTo(User, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        },
        as: "publisher"
    })
    
    await User.sync()
    await Wallet.sync()
    await Transaction.sync()
    await Message.sync()
    await Post.sync()
    await SavedPost.sync()
    await Photo.sync()
    
    // await User.create({
    //     username: "david",
    //     password: "david",
    //     email: "david@david.com",
    //     location: "UCA"
    // })

    console.log('Tables created')
})();
