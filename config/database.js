module.exports = {
    database: 'mongodb://localhost:27017/cmscart'
}

/*
#include <iostream>
using namespace std;

int b_search(vector<int> v, int start, int end, int val)
{
    if(start>end) 
    {
        return -1;
    }
    int  mid = start+(end-start)/2;

    if(v[mid]==val)
    {
        return val;
    }
    else if(v[mid] < val)
    {
        return b_search(v, mid+1, end, val);
    }
    else if(v[mid] > val)
    {
        return b_search(v, start, mid-1, val);
    }
    else{
        return -1;
    }
}

int get_ans(vector<int> v, int start, int end, int val) 
{
    int ind = b_search(v, start, end, val);

    if(ind==-1)
    {
        return INT_MAX;
    }
    else return ind;

}

bool is_equal(vector<int> A, vector<int> B)
{
    for(int i=0; i<A.size(); i++) 
    {
        if(A[i]!=B[i]) 
        {
            return false;
        }
    }
    return true;
}
int main() {
    int t;
    cin>>t;
    while(t--) {
        int n;
        cin>>n;
        vector<int>A(n,0), B(n, 0);
        for(int i=0; i<n; i++) 
        {
            cin>>A[i];
        }

         for(int i=0; i<n; i++)
        {
            cin>>B[i];
        }

        sort(A.begin(), A.end());
        sort(B.begin(), B.end());

        if(is_equal(A, B))
        {
            cout<<0<<endl;
            continue;
        }


        int i=0; 
        int j=0;
        int ans = 0;
        int flag = 0;
        while(i<n && j<n) 
        {
            if(A[i]==B[j])
            {
                ans+=0;
            }

           else if(A[i] < B[j])     //yani hmesha chotey k andr hi search kro  bda hi bnana h
            {
                op1 = get_ans(A, i+1, n-1, B[j]);         //find A[i] in A from i+1 to n
                if(op1==INT_MAX)
                {
                    cout<<-1<<endl;
                    flag = 1;
                    break;
                }
                ans+=min(A[op1], B[j]);
                swap(A[op1], B[j]);
            }

            else
            {
                op2 = get_ans(B, j+1, n-1, A[i]);
                if(op2==INT_MAX)
                {
                    cout<<-1<<endl;
                    flag = 1;
                    break;                    
                }
                ans+=min(B[op2], A[i]);
                swap(A[i], B[op2]);
            }
            i++;
            j++;

        }

        if(flag == 0) 
        {
            cout<<ans<<endl;
        }
    }
}

 */