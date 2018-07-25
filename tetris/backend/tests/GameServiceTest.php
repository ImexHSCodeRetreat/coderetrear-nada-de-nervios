<?php

namespace App\Tests;

use App\Entity\Board;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Service\GameService;

class GameServiceTest extends WebTestCase
{

    private $serv;
    private $secret = 'def000004ba8fee5d13ac2b2d8f13d3762bd732df2513df86da00f96da48c36623de3fe1bd45d0e63b82066fe31ccd1f090883d60312c989cd4893797b143c4a33495263';

    public function setUp(){
        $client = static::createClient();
        $container = $client->getContainer();
        $doctrine = $container->get('doctrine');
        $entityManager = $doctrine->getManager();
        $this->serv = new GameService($entityManager, $this->secret);
    }

    public function testgameVictory()
    {
/*        
        for($i=0; $i<9;$i++)
        {
            $tablero[$i]=null;
        }
*/      
        $arra=[];
        $tablero= new Board();
        
        
        $pos=[];
        $combinations=[[0,3,6],[1,4,7],[2,5,8],[0,1,2],[3.4,5],[6,7,8],[0,4,8],[2,4,6]];

        $index=array_rand($combinations);
        $result=$combinations[$index];

//CROSS
        for($i=0;$i<9;$i++)
        {
            $pos[$i]=null;
        }

        $pos[$result[0]]=Board::CROSS;
        $pos[$result[1]]=Board::CROSS;
        $pos[$result[2]]=Board::CROSS;

        $tablero->setPositions($pos);

        $p = $this->serv->gameVictory($tablero);
        $this->assertEquals( $result , $p);
    }
}