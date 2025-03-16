declare interface User {
    id?: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
    createTime?: string;
    updateTime?: string;
    organizationId?: string;
  }
  
  declare interface UserState {
    loginUser: User;
  }