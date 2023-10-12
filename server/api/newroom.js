const newRoom = (req, res) => {
    if (req.hostCfg.protected) {
        let ip = getIP(req);
        if (allowedIP(ip)) {
            return true;
        } else {
            hostCfg.authenticated = false;
            return false;
        }
    }
}