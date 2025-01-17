<script setup lang="ts">
// Stores
const authStore = useAuthStore();

// State
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Login
const formCompleted = computed(() => email.value && password.value);
const isAuth = computed(() => authStore.isAuthenticated);

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  if (!formCompleted.value) {
    errorMessage.value = 'Please fill out both email and password fields to sign in.';
    isLoading.value = false;
    return;
  }

  if (!isEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address.';
    isLoading.value = false;
    return;
  }

  try {
    await authStore.login(email.value, password.value);

    if (isAuth.value) {
      await navigateTo('/account');
    } else {
      errorMessage.value = 'Authentication failed. Please try to sign in again.';
    }
  } catch (error) {
    console.error('Error during account login:', error);

    if (error instanceof Error) {
      errorMessage.value = `${error.message}. Please try again later.`;
    }
  } finally {
    isLoading.value = false;
  }
};

// State
const showPassword = ref(false);

// Actions
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// SEO
useHead({
  title: 'Login'
});
</script>

<template>
  <section class="relative flex flex-col items-center justify-center">
    <div class="w-full px-6 my-32 md:max-w-lg">
      <h1 class="normal-case text-xl tracking-tight leading-none text-center">
        Login
      </h1>
      <form
        class="flex flex-col my-6"
        novalidate
        @submit.prevent="handleLogin"
      >
        <div class="relative w-full mb-2.5">
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            placeholder="Email Address"
            autocapitalize="off"
            autocomplete="email"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="password"
            v-model="password"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            minLength="{8}"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
          <button
            type="button"
            class="absolute inset-y-0 end-0 flex items-center px-3"
            @click="togglePassword"
          >
            <Icon
              name="ph:eye"
              class="h-5 w-5 shrink-0"
              :class="showPassword ? 'text-black' : 'text-zinc-400'"
            />
          </button>
        </div>
        <div class="flex mb-5">
          <NuxtLink
            :to="{ name: 'account-recover' }"
            class="max-w-fit normal-case transition duration-200 ease hover:text-zinc-500"
          >
            Forgot Password?
          </NuxtLink>
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
        >
          {{ isLoading === true ? 'Working...' : 'Sign in' }}
        </button>
      </form>
      <div class="flex flex-col mb-10">
        <p class="normal-case">New to Nitrogen?</p>
        <NuxtLink
          to="/account/register"
          class="max-w-fit normal-case underline decoration-dotted decoration-1 underline-offset-[3px] transition duration-200 ease-in-out hover:text-zinc-500"
        >
          Create an account
        </NuxtLink>
      </div>
      <p
        v-if="errorMessage"
        class="w-[75%] mx-auto normal-case text-red-500 text-center"
      >
        {{ errorMessage }}
      </p>
    </div>
  </section>
</template>
