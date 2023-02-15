import { HttpClient } from '@angular/common/http';
import { ParseSourceFile } from '@angular/compiler';
import { Component } from '@angular/core';
import { count } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'calculator';
  
  //operand and operators 
  expression:string='';
  last:string='0'; 
  before_last:string='0';
  last_operation:string='';
  counter:number=0; //counts the number of given operands (operations differ if only one operand was given)
  sign:string='';
  //booleans
  is_disabled:boolean=false; //some buttons are disabled in case of Errors
  is_first:boolean=true; //true when i begin to take the first digit of a number
  is_dot:boolean=false; //checks if the last input character was a dot
  is_op_last:boolean=false; //checks if the last input was an arithmetic operator
  is_unary:boolean=false;
  no_sign:boolean=false;
  first_is_Zero:boolean=false;
  res:string|null='' //because the response might be null && null can't be assigned to string type
  _url:string='http://localhost:8080/calculator/cal'

  constructor(private http:HttpClient){}

  arithmetic(char:string,sign:string){
    this.sign=sign;
    if(this.is_dot)
    {
      this.last+='0';
    }
    if (this.is_op_last){
      this.last_operation=char;
      this.sign=sign;
      this.expression=this.expression.slice(0,-1);
      this.expression+=sign;
      return;
    }
    
    if (this.last_operation!='' && this.last_operation!='equal'){
      console.log(this.last);
      this.request(this.last,this.before_last,this.last_operation);
      
      // this.expression=this.last+sign;
      
    }
    this.last_operation=char;
    this.is_op_last=true;
    this.is_first=true;
    console.log(this.last);
    this.expression=this.last+sign;
  }

  no(char:string){
    if(this.last_operation=='equal'){
      this.expression='';
    }
    if (this.is_first){
      this.before_last=this.last;
      this.last='';
      this.counter+=1;
    }
    this.is_first=false;
    // this.expression+=char;    
    this.last+=char;
    this.is_op_last=false;
    this.is_dot=false;
    
  }

  dot (char:string){
    this.last+=char;
    this.is_dot=true
    this.is_op_last=false;
  }

  clear(){
  
    this.sign='';
    this.is_dot=false;
    this.is_unary=false;
    this.is_disabled=false;
    this.is_first=true
    this.expression='';
    this.last='0';
    this.before_last='0';
    this.last_operation='';
    this.is_op_last=false;
    this.counter=0;
    this.no_sign=false;
    this.first_is_Zero=false;
  }

  del(){
    //for numbers only
    if (!this.is_first)
    {
      // this.expression=this.expression.slice(0,-1);
      if (this.last!=null){
        this.last=this.last.slice(0,-1)}
      if (this.last=='')
      { this.last='0';
        this.is_first=true;}
    }
  }

  eval(type:string=''){
  
    this.is_first=true;
    
    
    switch(type){
      
      case 'square_root':{
        //update last
        this.is_unary=true;
        if (this.last_operation!='equal' && this.before_last!='0'){
          this.expression=this.before_last+this.sign+'√('+this.last+')';
        }
        else{
          this.expression=' ';
        }
        
        this.request(this.last,this.before_last,'square_root');
        break;
      }
      case 'previous':{
      //for testing
        this.request(this.last,this.before_last,this.last_operation);
        break;
      }
      case 'reciprocal':{
        //update last
        this.is_unary=true;
        if (this.last_operation!='equal' && this.before_last!='0'){
          this.expression=this.before_last+this.sign+'(1/'+this.last+')';
        }
        else{
          this.expression=' ';
        }
        
        this.request(this.last,this.before_last,'reciprocal');
        break;
      }
      case 'percentage':{
        this.is_unary=true;
        if (this.last_operation=='add' || this.last_operation=='subtract'){
          this.expression=this.before_last+this.sign+this.last+'%';
          this.request(this.last,this.before_last,'percentage_as');
        }
        else if (this.last_operation=='multiply' || this.last_operation=='divide'){
          this.expression=this.before_last+this.sign+this.last+'%';
          this.request(this.last,this.before_last,'percentage_md');
        }
        else if (this.last_operation=='equal'){
          this.request(this.last,this.before_last,'percentage_eq');
          this.expression=' ';
        }
        else{
          this.clear();
        }
        break;
      }
      case 'square':{
        //update last
        this.is_unary=true;
        if (this.last_operation!='equal' && this.before_last!='0'){
          this.expression=this.before_last+this.sign+'('+this.last+')²';
        }
        else{
          this.expression=' ';
        }
        this.request(this.last,this.before_last,'square');
        break;
      }
      case 'negatiate':{
        this.is_unary=true;
        if (this.last_operation!='equal' && this.before_last!='0'){
          this.expression=this.before_last+this.sign+'negate('+this.last+')';
        }
        else{
          this.expression=' ';
        }
        this.request(this.last,this.before_last,'negatiate');
        break;
      }
      case 'evaluate':{
        
        if (this.is_op_last && this.last!='0')
        {
          this.request(this.last,this.last,this.last_operation);
          this.last_operation='equal';
          this.before_last='0';
          this.expression=' ';
          this.no_sign=true;


        }
        else if (this.before_last=='0' && this.last_operation!='equal'){
          this.request(this.last,'0',this.last_operation);
          this.first_is_Zero=true;
          this.last_operation='equal';
          return;
        }
        if (this.last_operation!='equal'){
          if(this.is_dot)
          {
            this.last+='0';
          }
          this.request(this.last,this.before_last,this.last_operation);
          this.last_operation='equal';
          this.before_last='0';
          this.sign='';
        }
        
        break;
      }
      default:{
        break;
      }
    }
    this.is_op_last=false;
    this.counter=1;
    
  }

  request(last_operand:string, before_last_operand:string, operator:string){
  
    this.http.get(this._url,
      {responseType:'text',
      params:{
        num1:last_operand,
        num2:before_last_operand,
        op:operator},
        observe:'response'}).subscribe(response => {
          this.res=response.body
          if (this.res=='E'){
            this.last=this.res;
            this.is_disabled=true;
          }
          else if (this.res!=null)
          {
            this.last=this.res;
            console.log("wasal hena");
            if(this.no_sign){
              this.expression=last_operand+this.sign+last_operand+'='+this.last;
              this.no_sign=false;
            }
            else if(this.first_is_Zero){
              this.expression=before_last_operand+this.sign+last_operand;
              this.first_is_Zero=false;
            }
            else if (!this.is_unary){
              this.expression=this.last+this.sign;
            }
            else{
              this.is_unary=false;
            }
          }
          
        })
    
      }
}
