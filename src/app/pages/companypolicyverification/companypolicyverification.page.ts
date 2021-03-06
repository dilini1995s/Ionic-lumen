import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {Storage} from '@ionic/storage';
import { AccessProviders } from '../../providers/access-providers';
import {HttpClient,HttpHeaders,HttpErrorResponse}  from '@angular/common/http';
@Component({
  selector: 'app-companypolicyverification',
  templateUrl: './companypolicyverification.page.html',
  styleUrls: ['./companypolicyverification.page.scss'],
})
export class CompanypolicyverificationPage implements OnInit {
id:any;
data:any;
verifi:any;
verification:any;
send:any;
nic:any;
companyid:any;
i:any;
risk:any;
n:any;
issue:any;
hide=false;
hide1=false;
hid1=false;
  constructor(
    private router:Router,
    private storage:Storage, 
    public http:HttpClient,
    private acessPr:AccessProviders) {}

ngOnInit() {
  this.storage.get('storage_company').then((res)=>{
      this.companyid=res.id;
     console.log(this.companyid);
      
      //this.name=this.datastorage.Name;
      //console.log(this.l1);
  
   this.storage.get('storage_companypolicy').then((res)=>{
      this.id=res;
      console.log( res);
      this.http.get(AccessProviders.server+'/getpolicy/'+this.id).subscribe((res:any)=>{ 
        this.data=res.message;
        console.log(res);
        this.nic=res.message[0].id;
        this.risk=res.message[0].risk_type;
        this.n=res.message[0].NIC;
        if(res.message[0].agent_verification==1)
          this.verifi=true;
        else if (res.message[0].agent_verification==0)
          this.verifi=false;
        if(res.message[0].risk_type!=""){
        this.hid1=true;
        }
     // if(res.message[0].agent_verification==1)    
      console.log(res.message[0].agent_verification);
      console.log(this.nic);
      this.storage.set('storage_afarmer',this.n);
      this.storage.set('storage_landnumber',res.message[0].land_number);
      })
    })
   }); 
  }

  verify(){
      console.log(this.verification);
    if(this.verification=='Accept'){
      this.send='Active';
      //this.init();
    }
    else
        this.send='Reject';
        console.log(this.id);
  
    console.log(this.send);
    return new Promise(resoler=>{
    
        let body={
          ver:this.send,
          issue:this.issue
        }
         this.acessPr.postcompanyverification(body,this.id).subscribe((res:any)=>{
            if(res.status==true){
                  this.router.navigate(['/company/companytab3']);
                  console.log('true');
                  this.init();
            }else{
                  console.log('false');
            }
        });
      });
  }

  back(){

    this.router.navigate(['/company/companytab3']);
  }
  view(){
    if(this.verification=='Reject'){
      this.hide=true;
    }
    else{
      this.hide=false;
    }
  }
  val(v1){
   
    return new Promise(resoler=>{
      let body={
        premium:v1
      }
      
      this.acessPr.postPremium(body,this.id).subscribe((res:any)=>{
          if(res.status==true){
              console.log('true');
          }else{
              console.log('false');
          }
      });
    });
  }
//get premium calculations equations
  init(){
    if(this.companyid==0 && this.risk!=""){

        this.http.get(AccessProviders.server+'/risk1/'+this.nic+'/'+this.companyid).subscribe((res:any)=>{ 
           console.log(res);
           console.log(this.nic);
           console.log(res.me[0]);
           this.val(res.me[0]);
            })
      }
    else if(this.risk=="")
        this.http.get(AccessProviders.server+'/wrisk/'+this.nic+'/'+this.companyid).
            subscribe((res:any)=>{ 
              console.log(res)
              this.val(res.me[0]);
        }) 
     
    
    
    else if(this.companyid==1){
        this.http.get(AccessProviders.server+'/risk2/'+this.nic+'/'+this.companyid).subscribe((res:any)=>{ 
          console.log(res);
          this.val(res.me[0]);
        })
           
    }
  
  }
  
  location(){
    this.router.navigate(['/viewlocation']);
  }
  farmerProfile(){
    //this.storage.remove('storage_afarmer');
    this.router.navigate(['/client']);

  }
  viewPhoto(){
    if(this.hide1==false)
    this.hide1=true;
    else
    this.hide1=false;
  }
}
