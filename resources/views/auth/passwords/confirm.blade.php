@extends('layouts.auth')
@section('title')
    {{trans('titles.confirm')}}
@endsection
@section('keywords')
    keywords
@endsection
@section('description')
    description
@endsection
@section('styles')
    <link href="{{ mix('dist/css/app.css') }}" rel="stylesheet">
@endsection
@section('scripts')
    <script>
        window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
        window.component = 'login';
        window.verified = {!! \Illuminate\Support\Facades\Session::has('verified') ? 'true' : 'false' !!};
        window.v_error = '{{ \Illuminate\Support\Facades\Session::has('error') ? \Illuminate\Support\Facades\Session::get('error') : false }}';
    </script>
    <script src="{{mix('dist/js/auth.js')}}"></script>
    <script src="{{mix('dist/js/hero-canvas.js')}}"></script>
@endsection