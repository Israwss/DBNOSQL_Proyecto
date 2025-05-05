'use client';
import * as React from 'react';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { SignInPage } from '@toolpad/core/SignInPage';
import { providerMap } from '../../../auth';
import signIn from './actions';
import Image from 'next/image';



function SignUpLink() {
  return (
    <span style={{ fontSize: '0.8rem' }}>
      Don&apos;t have an account?&nbsp;<Link href="/auth/signup">Sign up</Link>
    </span>
  );
}

function DemoInfo() {
  return (

    
    <Image
    src="/logo-pizzas-mibuen.png"
    width={60}
    height={60}
    alt="Picture of the author"
  />

    

    
    
  );
}





export default function SignIn() {
  return (

    
    <SignInPage
      providers={providerMap}
      signIn={signIn}
      slots={{
        signUpLink: SignUpLink,
        subtitle: DemoInfo,
      }}
    />
  );
}
