'use client';

import { Icons } from '@/components/Icons'
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCredentialsValidator, AuthCredentialValidatorType } from "@/lib/validators/SignupValidator";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter, useSearchParams } from 'next/navigation'
import { trpc } from "@/trpc/client";
import { useMutation } from "react-query";
import { createUserRequest } from "@/api/UserRequest";
import { cartHooks } from "@/hooks/cartHooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Page = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const origin = searchParam.get("origin")
  const form = useForm<AuthCredentialValidatorType>({
    resolver: zodResolver(AuthCredentialsValidator),
    defaultValues: {
      email: "",
      password: "",
      province: "MB",
      addressLine1: "",
      addressLine2: "",
      postalCode: ""
    }
  });

  /**
   * payload signup
   */
  const { mutateAsync: payloadSignUp } = trpc.auth.createPayloadUser.useMutation()
  const { getItems } = cartHooks();

  /**
   * signup
   */
  const { mutateAsync: createUser } = useMutation(createUserRequest, {
    retry: false,
    onError: (error) => {
      toast.error(`${error}`);
    },
    onSuccess: (data) => {
      toast.success(`Verification email sent to ${data?.email}`);
      // redirect user to sign in
      router.push(`/verify-email?to=${data?.email}`)
    }
  });
  const handleSignUp = async ({ email, password, province, addressLine1, addressLine2, postalCode }: AuthCredentialValidatorType) => {
    // payload signup
    const payloadSignUpInfo: { success: boolean, sentToEmail: string, payloadUserId: string | number } = await payloadSignUp({
      email,
      password,
      province,
      addressLine1,
      addressLine2,
      postalCode
    })
    // signup
    await createUser({
      email,
      password,
      province,
      addressLine1,
      addressLine2,
      postalCode,
      productIdList: getItems()?.map(cartItem => cartItem.product.id!),
      payloadId: payloadSignUpInfo.payloadUserId as string
    });
  }

  return (
      <>
        <div className='container mb-24 relative flex pt-20 flex-col items-center justify-center lg:px-0'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col items-center space-y-2 text-center'>
              <Icons.logo className='h-20 w-20'/>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Create an account
              </h1>
              <Link href={origin ? `/sign-in?${origin}` : '/sign-in'} className={buttonVariants({ variant: 'link', className: 'gap-1.5' })}>
                Already have an account? Sign-in<ArrowRight className='h-4 w-4'/>
              </Link>
            </div>

            <div className="grid gap-6">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleSignUp)} className="grid gap-2">
                  <FormField control={form.control} name='email' render={({ field }) => (
                      <FormItem className="py-2 grid gap-1">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type='email' className={cn({ "focus-visible:ring-red-500": form.formState.errors.email })}
                                 placeholder='Email'/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}/>
                  <FormField control={form.control} name='password' render={({ field }) => (
                      <FormItem className="py-2 grid gap-1">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type='password'
                                 className={cn({ "focus-visible:ring-red-500": form.formState.errors.password })}
                                 placeholder='password'/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}/>
                  <FormField control={form.control} name='province' render={({ field }) => (
                      <FormItem className='py-2 grid gap-1'>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Province"/>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AB">Alberta</SelectItem>
                              <SelectItem value="BC">British Columbia</SelectItem>
                              <SelectItem value="MB">Manitoba</SelectItem>
                              <SelectItem value="NB">New Brunswick</SelectItem>
                              <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                              <SelectItem value="NT">Northwest Territories</SelectItem>
                              <SelectItem value="NS">Nova Scotia</SelectItem>
                              <SelectItem value="NU">Nunavut</SelectItem>
                              <SelectItem value="ON">Ontario</SelectItem>
                              <SelectItem value="PE">Prince Edward Island</SelectItem>
                              <SelectItem value="QC">Quebec</SelectItem>
                              <SelectItem value="SK">Saskatchewan</SelectItem>
                              <SelectItem value="YT">Yukon</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                  )}/>
                  <FormField control={form.control} name='addressLine1' render={({ field }) => (
                      <FormItem className="py-2 grid gap-1">
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input {...field} type='text' className={cn({ "focus-visible:ring-red-500": form.formState.errors.email })}
                                 placeholder='Address Line 1'/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}/>
                  <FormField control={form.control} name='addressLine2' render={({ field }) => (
                      <FormItem className="py-2 grid gap-1">
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input {...field} type='text' className={cn({ "focus-visible:ring-red-500": form.formState.errors.email })}
                                 placeholder='Address Line 2 (Optional)'/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}/>
                  <FormField control={form.control} name='postalCode' render={({ field }) => (
                      <FormItem className="py-2 grid gap-1">
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} type='text' className={cn({ "focus-visible:ring-red-500": form.formState.errors.email })}
                                 placeholder=''/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}/>
                  <Button type='submit'>Sign up</Button>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </>
  )
      ;
};

export default Page;