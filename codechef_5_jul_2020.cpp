#include <bits/stdc++.h>
using namespace std;

int b_search(vector<int> v, int start, int end, int val)
{
    if(start>end) 
    {	
    	//cout<<"hgfhf"<<endl;
        return -1;
    }
    int  mid = start+(end-start)/2;

    if(v[mid]==val)
    {
    	//cout<<"aa"<<endl;
        return mid;
    }
    else if(v[mid] < val)
    {
    	cout<<"bb"<<endl;
        return b_search(v, mid+1, end, val);
    }
    else if(v[mid] > val)
    {
    	//cout<<"cc"<<endl;
        return b_search(v, start, mid-1, val);
    }
    else{
    	//cout<<"zz"<<endl;
        return -1;
    }
}

int get_ans(vector<int> v, int start, int end, int val) 
{
    int ind = b_search(v, start, end, val);

    if(ind==-1)
    {
        return -1;
    }
    else return ind;

}

bool is_equal(vector<int> A, vector<int> B)
{
	//cout<<"hh"<<endl;
    for(int i=0; i<A.size(); i++) 
    {
        if(A[i]!=B[i]) 
        {	
        	//cout<<"hh2"<<endl;
            return false;
        }
    }
    //cout<<"hh3"<<endl;
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
                int op1 = get_ans(A, i+1, n-1, A[i]);         //find A[i] in A from i+1 to n
                if(op1==-1)
                 {
                    cout<<-1<<endl;
                    flag = 1;
                    break;
                }
                ans+=min(A[op1], B[j]);
                swap(A[op1], B[j]);
                //cout<<i<<" kk"<<endl;
            }

            else
            {
               int op2 = get_ans(B, j+1, n-1, B[j]);
                if(op2==-1)
                {
                    cout<<-1<<endl;
                    flag = 1;
                    break;                    
                }
                ans+=min(B[op2], A[i]);
                swap(A[i], B[op2]);
               // cout<<"mm"<<endl;
            }
            i++;
            j++;

        }
		
		//cout<<"hello"<<endl;
        if(flag == 0) 
        {
            cout<<ans<<endl;
        }
    }
}
