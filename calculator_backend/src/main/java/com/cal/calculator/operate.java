package com.cal.calculator;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.lang.Math;

@RestController
@CrossOrigin
@RequestMapping("/calculator")
public class operate {

    double add(double n1,double n2)
    {
        return (n1+n2);
    }
    double multiply(double n1,double n2)
    {
        return (n1*n2);
    }
    double divide(double n1,double n2)
    {
        return (n2/n1);
    }
    double subtract(double n1,double n2)
    {
        return (n2-n1);
    }
    double reciprocal(double n)
    {
        return (1/n);
    }
    double square(double n)
    {
        return (Math.pow(n,2));
    }
    double square_root(double n)
    {
        return (Math.sqrt(n));
    }
    double percentage_add_subtraction(double n1,double n2){
        return (multiply(n2,divide(100,n1)));
    }
    double percentage_multiply_divide(double n1){
        return (n1/100);
    }
    double percentage_equal(double n1){
        return (square(n1)/100);
    }

    @GetMapping("/cal")
    public ResponseEntity<String> sent_http(@RequestParam("num1") double num1,@RequestParam("num2") double num2,@RequestParam("op") String op){
        //initializations
        String ans="null";
        double answer=0;
        
        if (op.equals("add")) {
            answer=add(num1,num2);
        }
        else if (op.equals("subtract")) {
            answer=subtract(num1,num2);
        }
        else if (op.equals("multiply")) {
            answer=multiply(num1,num2);
        }
        else if (op.equals("divide")) {
            if (num1==0){
                return new ResponseEntity<String>("E", HttpStatus.NO_CONTENT);
            }
            answer=divide(num1,num2);
        }
        else if (op.equals("negatiate")) {
            answer=multiply(-1,num1);
        }
        else if (op.equals("reciprocal")) {
            if (num1==0){
                return new ResponseEntity<String>("E", HttpStatus.OK);
            }
            answer=reciprocal(num1);
        }
        else if (op.equals("square")) {
            answer=square(num1);
        }
        else if (op.equals("square_root")) {
            if (num1<0){
                return new ResponseEntity<String>("E", HttpStatus.OK);
            }
            answer=square_root(num1);
        }
        else if (op.equals("percentage_as")) {
            answer=percentage_add_subtraction(num1,num2);
        }
        else if (op.equals("percentage_md")) {
            answer=percentage_multiply_divide(num1);
        }
        else if (op.equals("percentage_eq")) {
            answer=percentage_equal(num1);
        }
        System.out.println(answer);

        if (answer== (int) answer)
            ans=Integer.toString((int)answer);
        else
            ans=Double.toString(answer);

        return new ResponseEntity<String>(ans, HttpStatus.OK);
    }
}
