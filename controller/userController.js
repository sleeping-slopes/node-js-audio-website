const response = require('./../response')
const connection = require('../settings/database')



exports.getByVerifiedJWT = (req,res) =>
{
    connection.query('SELECT `login` FROM `users` WHERE `login` = ?',[req.user.login],(error,rows,fields)=>
    {
        if (error)
        {
            response.status(400,error,res);
        }
        else if (rows.length<1)
        {
            response.status(404,{error: 'user not found'},res);
        }
        else
        {
            const row = rows[0];
            response.status(200,row,res);
        }
    })
}

exports.getByLogin = (req,res) =>
{
    connection.query('SELECT `username`,`status`,`bio`,`city`,`country`,`verified` FROM `users` WHERE `login` = ?',[req.params.login],(error,rows,fields)=>
    {
        if (error)
        {
            response.status(400,error,res);
        }
        else if (rows.length<1)
        {
            response.status(404,{error: 'user not found'},res);
        }
        else
        {
            const row = rows[0];
            response.status(200,row,res);
        }
    })
}

exports.getLikedSongs = (req,res) =>
{

    connection.query('SELECT `songID` as `id`, ROW_NUMBER() OVER(PARTITION BY null ORDER BY `song_likes`.`time` DESC) AS `pos` FROM `song_likes` WHERE `userLogin` = ?',[req.params.login],(error,rows,fields)=>
    {

        if (error)
        {
            response.status(400,error,res);
        }
        else
        {
            response.status(200,rows,res);
        }
    })
}

exports.getLikedPlaylists = (req,res) =>
{
    connection.query('SELECT `playlistID` as `id` FROM `playlist_likes` WHERE `userLogin` = ? ORDER BY `playlist_likes`.`time` DESC',[req.params.login],(error,rows,fields)=>
    {

        if (error)
        {
            response.status(400,error,res);
        }
        else
        {
            response.status(200,rows,res);
        }
    })
}

exports.getSongs = (req,res) =>
{

    connection.query('SELECT `songID` as `id`, ROW_NUMBER() OVER(PARTITION BY null ORDER BY `created_at` DESC) AS `pos` FROM `view_song_artists` WHERE `login` = ?',[req.params.login],(error,rows,fields)=>
    {

        if (error)
        {
            response.status(400,error,res);
        }
        else
        {
            response.status(200,rows,res);
        }
    })
}

exports.getProfilePicture = (req,res) =>
{
    connection.query("SELECT `profile_picture` FROM `users` WHERE `login` = ?",[req.params.login],(error,rows,fields)=>
    {
        if (error)
        {
            response.status(400,error,res);
        }
        else if (rows.length<1)
        {
            response.status(404,{error: 'user not found'},res);
        }
        else
        {
            const row = rows[0];
            res.sendFile("images/user images/profile pictures/"+row.profile_picture,{root: '.'}, function (error)
            {
                if (error)
                {
                  response.status(error.status,error,res);
                }
            });
        }
    })
}

exports.getBanner = (req,res) =>
{
    connection.query("SELECT `banner` FROM `users` WHERE `login` = ?",[req.params.login],(error,rows,fields)=>
    {
        if (error)
        {
            response.status(400,error,res);
        }
        else if (rows.length<1)
        {
            response.status(404,{error: 'user not found'},res);
        }
        else
        {
            const row = rows[0];
            res.sendFile("images/user images/banner/"+row.banner,{root: '.'}, function (error)
            {
                if (error)
                {
                  response.status(error.status,error,res);
                }
            });
        }
    })
}