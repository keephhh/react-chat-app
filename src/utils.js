export function getRedirectPath(data) {
        let path = data.type == 'boss' ? '/boss' : '/genius';
        path = !data.avatar ? path + 'info' : '/desk'; 
        return path;
}