const response = require('./../response')
const queryPromise = require('../settings/database')

exports.getSongs = async (req,res) =>
{
    try
    {
        const playlist = { id:'[API] '+req.params.q+" SEARCH", name:"Search results for “"+req.params.q+"“", artists:[{name:"Auto generated"}] };

        const getSongByNameSQL ="SELECT `id`,ROW_NUMBER() OVER(PARTITION BY null ORDER BY `likes_count` DESC) - 1 AS `pos` FROM `view_song` WHERE `name` LIKE ?";
        const songs = await queryPromise(getSongByNameSQL,['%'+req.params.q+'%']);
        if (songs.length<1) playlist.songList = {error:{status:"404", message:'Sorry, we didn\'t find any results for “'+req.params.q+'”'}};
        else playlist.songList = { id: playlist.id, songs: songs };

        return response.status(200,playlist,res);
    }
    catch(error)
    {
        return response.status(400,error.message,res);
    }
}

exports.getPlaylists = async (req,res) =>
{
    try
    {
        const getPlaylistByNameSQL ="SELECT `id` FROM `view_playlist` WHERE `name` LIKE ? OR `id` LIKE ? ORDER BY `likes_count` DESC";
        let playlists = await queryPromise(getPlaylistByNameSQL,['%'+req.params.q+'%','%'+req.params.q+'%']);
        if (playlists.length<1) playlists = {error:{status:404,message:'Sorry, we didn\'t find any results for “'+req.params.q+'”'}};

        return response.status(200,playlists,res);
    }
    catch(error)
    {
        return response.status(400,error.message,res);
    }
}

exports.getUsers = async (req,res) =>
{
    try
    {
        const getUserByLoginUsernamePseudonameSQL = "SELECT  DISTINCT `login` FROM `view_user_profile` LEFT JOIN `playlist_artists` ON `playlist_artists`.`artistLogin`=`view_user_profile`.`login` LEFT JOIN `song_artists` ON `song_artists`.`artistLogin`=`view_user_profile`.`login` WHERE `view_user_profile`.`login` LIKE ? OR `view_user_profile`.`username` LIKE ? OR `playlist_artists`.`artistName` LIKE ? OR `song_artists`.`artistName` LIKE ? ORDER BY `view_user_profile`.`followers_count` DESC";
        let users = await queryPromise(getUserByLoginUsernamePseudonameSQL,Array(4).fill('%'+req.params.q+'%'));
        if (users.length<1) users = {error:{status:404,message:'Sorry, we didn\'t find any results for “'+req.params.q+'”'}};

        return response.status(200,users,res);
    }
    catch(error)
    {
        return response.status(400,error.message,res);
    }
}