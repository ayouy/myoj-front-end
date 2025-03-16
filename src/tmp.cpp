#include <vector>
using namespace std;
class Solution {
public:
    void getpost(vector<int> & postm,vector<int> height)
    {
        for(int i=height.size()-1;i>=0;--i)
        {
            postm[i]=i==height.size()-1?height[i]:max(postm[i+1],height[i]);
        }
    }
    void  getprev(vector<int> & prevm,vector<int> height)
    {
        for(int i=0;i<height.size();i++)
        {
            prevm[i]=i==0?height[i]:max(prevm[i-1],height[i]);
        }
    }
    int trap(vector<int>& height) {
        vector<int> postm(height.size()),prevm(height.size());
        getpost(postm,height);
        getprev(prevm,height);
        int ans=0;
        for(int i=0;i<height.size();i++)
        {
            ans+=min(postm[i],prevm[i])-height[i];
        }
        return ans;
    }
};
